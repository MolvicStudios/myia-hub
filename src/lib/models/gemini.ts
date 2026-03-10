import type { ModelClient } from './base';
import { buildHeaders } from './base';
import type { ModelRequestPayload, ModelResponse } from '$lib/types';
import { WORKER_PROXY } from '$lib/config';

const ENDPOINT = `${WORKER_PROXY}/api/gemini`;

/** Build Gemini-compatible contents array with proper alternating roles */
function buildGeminiPayload(messages: { role: string; content: string }[]) {
	// Extract system messages as systemInstruction
	const systemParts = messages
		.filter((m) => m.role === 'system' && m.content.trim())
		.map((m) => ({ text: m.content }));

	// Build contents with non-system messages, ensuring alternating roles
	const raw = messages
		.filter((m) => m.role !== 'system' && m.content.trim())
		.map((m) => ({
			role: m.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: m.content }]
		}));

	// Merge consecutive same-role messages (Gemini requires alternating)
	const contents: typeof raw = [];
	for (const msg of raw) {
		const last = contents[contents.length - 1];
		if (last && last.role === msg.role) {
			last.parts.push(...msg.parts);
		} else {
			contents.push({ ...msg, parts: [...msg.parts] });
		}
	}

	// Gemini requires at least one user message
	if (contents.length === 0) {
		contents.push({ role: 'user', parts: [{ text: '.' }] });
	} else if (contents[0].role !== 'user') {
		contents.unshift({ role: 'user', parts: [{ text: '.' }] });
	}

	const body: Record<string, unknown> = { contents };
	if (systemParts.length > 0) {
		body.systemInstruction = { parts: systemParts };
	}
	return body;
}

export const geminiClient: ModelClient = {
	async send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse> {
		const model = payload.model || 'gemini-2.0-flash';
		const geminiBody = buildGeminiPayload(payload.messages);

		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				...geminiBody,
				model,
				generationConfig: {
					temperature: payload.temperature ?? 0.7,
					maxOutputTokens: payload.maxTokens ?? 4096
				}
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Gemini error ${res.status}: ${err}`);
		}

		const data = await res.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

		return { content: text, model, provider: 'gemini' };
	},

	async sendStream(
		payload: ModelRequestPayload,
		apiKey: string,
		onChunk: (text: string) => void,
		signal?: AbortSignal
	): Promise<ModelResponse> {
		const model = payload.model || 'gemini-2.0-flash';
		const geminiBody = buildGeminiPayload(payload.messages);

		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				...geminiBody,
				model,
				stream: true,
				generationConfig: {
					temperature: payload.temperature ?? 0.7,
					maxOutputTokens: payload.maxTokens ?? 4096
				}
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Gemini stream error ${res.status}: ${err}`);
		}

		const reader = res.body!.getReader();
		const decoder = new TextDecoder();
		let full = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			for (const line of chunk.split('\n')) {
				if (!line.startsWith('data: ')) continue;
				try {
					const json = JSON.parse(line.slice(6));
					const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
					if (text) {
						full += text;
						onChunk(full);
					}
				} catch { /* skip */ }
			}
		}

		return { content: full, model, provider: 'gemini' };
	}
};
