/**
 * Base model client interface.
 * Each provider implements this to normalize API calls.
 */
import type { ModelRequestPayload, ModelResponse } from '$lib/types';

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
