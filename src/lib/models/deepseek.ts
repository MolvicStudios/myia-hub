import type { ModelClient } from './base';
import { buildHeaders, buildOpenAIMessages } from './base';
import type { ModelRequestPayload, ModelResponse } from '$lib/types';
import { WORKER_PROXY } from '$lib/config';

const ENDPOINT = `${WORKER_PROXY}/api/deepseek`;

export const deepseekClient: ModelClient = {
	async send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse> {
		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify({
				model: payload.model,
				messages: buildOpenAIMessages(payload.messages, payload.attachments),
				max_tokens: payload.maxTokens ?? 4096,
				temperature: payload.temperature ?? 0.7
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`DeepSeek error ${res.status}: ${err}`);
		}

		const data = await res.json();
		return {
			content: data.choices?.[0]?.message?.content ?? '',
			model: data.model,
			provider: 'deepseek',
			usage: data.usage
				? { promptTokens: data.usage.prompt_tokens, completionTokens: data.usage.completion_tokens }
				: undefined
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
				messages: buildOpenAIMessages(payload.messages, payload.attachments),
				max_tokens: payload.maxTokens ?? 4096,
				temperature: payload.temperature ?? 0.7,
				stream: true
			}),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`DeepSeek stream error ${res.status}: ${err}`);
		}

		const reader = res.body!.getReader();
		const decoder = new TextDecoder();
		let full = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			for (const line of chunk.split('\n')) {
				if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
				try {
					const json = JSON.parse(line.slice(6));
					const delta = json.choices?.[0]?.delta?.content ?? '';
					if (delta) {
						full += delta;
						onChunk(full);
					}
				} catch { /* skip */ }
			}
		}

		return { content: full, model: payload.model, provider: 'deepseek' };
	}
};
