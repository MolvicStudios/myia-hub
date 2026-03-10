import type { ModelClient } from './base';
import type { ModelRequestPayload, ModelResponse, FileAttachment } from '$lib/types';
import { get } from 'svelte/store';
import { settings } from '$lib/stores/settingsStore';

/** Resolve the Ollama endpoint from user settings (direct local connection) */
function getEndpoint(): string {
	const base = get(settings).ollamaEndpoint || 'http://localhost:11434';
	return `${base.replace(/\/+$/, '')}/api/chat`;
}

/** Build Ollama messages — images go in a separate images array per message */
function buildOllamaMessages(
	messages: { role: string; content: string }[],
	attachments?: FileAttachment[]
): Array<{ role: string; content: string; images?: string[] }> {
	return messages.map((m, i) => {
		const isLastUser = m.role === 'user' && i === messages.length - 1;
		if (!isLastUser || !attachments?.length) {
			return { role: m.role, content: m.content };
		}
		const images: string[] = [];
		let content = m.content;
		for (const att of attachments) {
			if (att.data && att.type.startsWith('image/')) {
				const raw = att.data.includes(',') ? att.data.split(',')[1] : att.data;
				images.push(raw);
			} else if (att.preview && (att.type.startsWith('text/') || att.type === 'application/json')) {
				content += `\n\n[Archivo: ${att.name}]\n${att.preview}`;
			}
		}
		return images.length > 0
			? { role: m.role, content, images }
			: { role: m.role, content };
	});
}

export const ollamaClient: ModelClient = {
	async send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse> {
		const res = await fetch(getEndpoint(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: payload.model,
				messages: buildOllamaMessages(payload.messages, payload.attachments),
				stream: false
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Ollama error ${res.status}: ${err}`);
		}

		const data = await res.json();
		return {
			content: data.message?.content ?? '',
			model: payload.model,
			provider: 'ollama'
		};
	},

	async sendStream(
		payload: ModelRequestPayload,
		apiKey: string,
		onChunk: (text: string) => void,
		signal?: AbortSignal
	): Promise<ModelResponse> {
		const res = await fetch(getEndpoint(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: payload.model,
				messages: buildOllamaMessages(payload.messages, payload.attachments),
				stream: true
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Ollama stream error ${res.status}: ${err}`);
		}

		const reader = res.body!.getReader();
		const decoder = new TextDecoder();
		let full = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			for (const line of chunk.split('\n').filter(Boolean)) {
				try {
					const json = JSON.parse(line);
					if (json.message?.content) {
						full += json.message.content;
						onChunk(full);
					}
				} catch { /* skip */ }
			}
		}

		return { content: full, model: payload.model, provider: 'ollama' };
	}
};
