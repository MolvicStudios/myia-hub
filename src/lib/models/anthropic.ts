import type { ModelClient } from './base';
import { buildHeaders } from './base';
import type { ModelRequestPayload, ModelResponse } from '$lib/types';
import { WORKER_PROXY } from '$lib/config';

const ENDPOINT = `${WORKER_PROXY}/api/anthropic`;

export const anthropicClient: ModelClient = {
	async send(payload: ModelRequestPayload, apiKey: string, signal?: AbortSignal): Promise<ModelResponse> {
		const body = {
			model: payload.model,
			max_tokens: payload.maxTokens ?? 4096,
			messages: payload.messages
				.filter((m) => m.role !== 'system')
				.map((m) => ({ role: m.role, content: m.content }))
		};

		const systemMsg = payload.messages.find((m) => m.role === 'system');

		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify(systemMsg ? { ...body, system: systemMsg.content } : body),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Anthropic error ${res.status}: ${err}`);
		}

		const data = await res.json();
		const content = data.content?.map((c: { text: string }) => c.text).join('') ?? '';

		return {
			content,
			model: data.model,
			provider: 'anthropic',
			usage: data.usage
				? { promptTokens: data.usage.input_tokens, completionTokens: data.usage.output_tokens }
				: undefined
		};
	},

	async sendStream(
		payload: ModelRequestPayload,
		apiKey: string,
		onChunk: (text: string) => void,
		signal?: AbortSignal
	): Promise<ModelResponse> {
		const body: Record<string, unknown> = {
			model: payload.model,
			max_tokens: payload.maxTokens ?? 4096,
			stream: true,
			messages: payload.messages
				.filter((m) => m.role !== 'system')
				.map((m) => ({ role: m.role, content: m.content }))
		};

		const systemMsg = payload.messages.find((m) => m.role === 'system');
		if (systemMsg) body.system = systemMsg.content;

		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: buildHeaders(apiKey),
			body: JSON.stringify(body),
			signal
		});

		if (!res.ok) {
			const err = await res.text();
			throw new Error(`Anthropic stream error ${res.status}: ${err}`);
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
					if (json.type === 'content_block_delta') {
						full += json.delta?.text ?? '';
						onChunk(full);
					}
				} catch { /* skip */ }
			}
		}

		return { content: full, model: payload.model, provider: 'anthropic' };
	}
};
