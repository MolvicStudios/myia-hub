/**
 * Base model client interface.
 * Each provider implements this to normalize API calls.
 */
import type { ModelRequestPayload, ModelResponse, FileAttachment } from '$lib/types';

export interface ModelClient {
	send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse>;
	sendStream?(
		payload: ModelRequestPayload,
		apiKey: string,
		onChunk: (text: string) => void,
		signal?: AbortSignal
	): Promise<ModelResponse>;
	validateKey?(apiKey: string): Promise<boolean>;
}

/** Helper to build standard headers */
export function buildHeaders(apiKey: string, extra: Record<string, string> = {}): HeadersInit {
	return {
		'Content-Type': 'application/json',
		...extra,
		...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
	};
}

/** Build OpenAI-compatible multimodal message content (used by OpenAI, Mistral, Groq, OpenRouter, DeepSeek) */
export function buildOpenAIMessages(
	messages: { role: string; content: string }[],
	attachments?: FileAttachment[]
): { role: string; content: string | Array<Record<string, unknown>> }[] {
	return messages.map((m, i) => {
		const isLastUser = m.role === 'user' && i === messages.length - 1;
		// Only attach files to the last user message (the one that triggered this request)
		if (!isLastUser || !attachments?.length) {
			return { role: m.role, content: m.content };
		}
		const parts: Array<Record<string, unknown>> = [{ type: 'text', text: m.content }];
		for (const att of attachments) {
			if (att.data && att.type.startsWith('image/')) {
				parts.push({
					type: 'image_url',
					image_url: { url: att.data.startsWith('data:') ? att.data : `data:${att.type};base64,${att.data}` }
				});
			} else if (att.preview && (att.type.startsWith('text/') || att.type === 'application/json')) {
				// Inject text file content inline
				parts[0] = { type: 'text', text: `${m.content}\n\n[Archivo: ${att.name}]\n${att.preview}` };
			}
		}
		return { role: m.role, content: parts.length > 1 ? parts : m.content };
	});
}
