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

/** Decode full text content from a base64 data URI */
function decodeTextAttachment(att: FileAttachment): string {
	if (!att.data) return att.preview ?? '';
	try {
		const b64 = att.data.includes(',') ? att.data.split(',')[1] : att.data;
		const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch {
		return att.preview ?? '';
	}
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
		const textParts: string[] = [];
		const imageParts: Array<Record<string, unknown>> = [];
		for (const att of attachments) {
			if (att.data && att.type.startsWith('image/')) {
				imageParts.push({
					type: 'image_url',
					image_url: { url: att.data.startsWith('data:') ? att.data : `data:${att.type};base64,${att.data}` }
				});
			} else if (att.type.startsWith('text/') || att.type === 'application/json') {
				const fullText = decodeTextAttachment(att);
				textParts.push(`[Archivo: ${att.name}]\n${fullText}`);
			}
		}
		const textContent = textParts.length > 0
			? `${m.content}\n\n${textParts.join('\n\n')}`
			: m.content;
		if (imageParts.length > 0) {
			return { role: m.role, content: [{ type: 'text', text: textContent }, ...imageParts] };
		}
		return { role: m.role, content: textContent };
	});
}
