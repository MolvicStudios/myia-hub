import { get } from 'svelte/store';
import {
	activeChatId,
	activeMessages,
	addMessage,
	updateLastAssistantMessage
} from '$lib/stores/chatStore';
import { avatarState, selectedModel, selectedProvider } from '$lib/stores/uiStore';
import { settings } from '$lib/stores/settingsStore';
import { saveMemory, loadMemory } from '$lib/stores/memoryStore';
import { parseMentions } from '$lib/utils/mentionParser';
import { routeMessageStream } from '$lib/models/router';
import { getModelDef } from '$lib/models/registry';
import type { FileAttachment, ModelProvider, ChatMessage } from '$lib/types';

/** Map common HTTP/API errors to user-friendly Spanish messages */
function friendlyError(err: unknown): string {
	const msg = err instanceof Error ? err.message : String(err);
	if (msg.includes('401') || msg.includes('Unauthorized')) return 'Clave API inválida o expirada. Revisa tu configuración.';
	if (msg.includes('400') || msg.includes('Bad Request')) return 'Solicitud rechazada por el modelo. Verifica tu API key y que el modelo esté disponible.';
	if (msg.includes('402') || msg.includes('Payment Required')) return 'Crédito agotado en este proveedor. Recarga tu saldo o usa otro modelo.';
	if (msg.includes('403') || msg.includes('Forbidden')) return 'Acceso denegado. Tu API key no tiene permisos para este modelo.';
	if (msg.includes('429') || msg.includes('rate')) return 'Demasiadas peticiones. Espera un momento e intenta de nuevo.';
	if (msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('Ollama')) return 'Servicio no disponible. Los modelos Ollama requieren servidor local.';
	if (msg.includes('500') || msg.includes('Internal Server')) return 'Error del servidor del modelo. Intenta de nuevo más tarde.';
	if (msg.includes('abort') || msg.includes('AbortError')) return 'Generación cancelada.';
	if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return 'Error de red. Verifica tu conexión a internet.';
	return msg;
}

interface SendParams {
	text: string;
	files: FileAttachment[];
	mentions: string[];
	/** Pass messages getter for chat/[id] route (from derived $state) */
	getMessages?: () => ChatMessage[];
	scrollToBottom: () => void;
}

export async function handleSendMessage(data: SendParams) {
	const chatId = get(activeChatId);
	if (!chatId) return;

	const $selectedModel = get(selectedModel);
	const $selectedProvider = get(selectedProvider);

	const parsed = parseMentions(data.text, $selectedModel);

	addMessage({
		role: 'user',
		content: data.text,
		attachments: data.files.length > 0 ? data.files : undefined
	});
	data.scrollToBottom();

	const targets = parsed.mentions.length > 0
		? parsed.mentions
		: [{ model: $selectedModel, provider: $selectedProvider as ModelProvider, alias: '', text: parsed.cleanText }];

	for (const target of targets) {
		const modelDef = getModelDef(target.model);
		const provider = modelDef?.provider ?? (target.provider as ModelProvider);
		const text = target.text || parsed.cleanText;

		addMessage({
			role: 'assistant',
			content: '',
			model: modelDef?.name ?? target.model,
			provider
		});
		data.scrollToBottom();

		avatarState.set('loading');

		try {
			const messages = data.getMessages ? data.getMessages() : get(activeMessages);
			const history = messages
				.filter((m) => m.content.trim())
				.slice(-20)
				.map((m) => ({ role: m.role, content: m.content }));

			const $settings = get(settings);
			if ($settings.memoryEnabled) {
				const mem = await loadMemory(target.model);
				if (mem.length > 0) {
					history.unshift(...mem.map((m) => ({ role: m.role, content: m.content })));
				}
			}

			avatarState.set('typing');

			await routeMessageStream(
				{ model: target.model, provider, messages: history, stream: true },
				(partial) => {
					updateLastAssistantMessage(partial);
					data.scrollToBottom();
				}
			);

			avatarState.set('idle');

			if ($settings.memoryEnabled) {
				const recentMsgs = data.getMessages ? data.getMessages() : get(activeMessages);
				await saveMemory(target.model, recentMsgs.slice(-10));
			}
		} catch (err) {
			avatarState.set('error');
			updateLastAssistantMessage(`⚠️ Error: ${friendlyError(err)}`);
			data.scrollToBottom();
			setTimeout(() => avatarState.set('idle'), 3000);
		}
	}
}
