import type { ModelClient } from './base';
import { buildHeaders } from './base';
import type { ModelRequestPayload, ModelResponse } from '$lib/types';
import { WORKER_PROXY } from '$lib/config';

const ENDPOINT = `${WORKER_PROXY}/api/ollama`;

export const ollamaClient: ModelClient = {
	async send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse> {
		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				model: payload.model,
				messages: payload.messages.map((m) => ({ role: m.role, content: m.content })),
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
		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				model: payload.model,
				messages: payload.messages.map((m) => ({ role: m.role, content: m.content })),
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
