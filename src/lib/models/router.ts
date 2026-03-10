/**
 * Model Router — central dispatch for all model requests.
 * Resolves the correct client for a provider and forwards the request.
 */
import type { ModelProvider, ModelRequestPayload, ModelResponse } from '$lib/types';
import type { ModelClient } from './base';
import { openaiClient } from './openai';
import { anthropicClient } from './anthropic';
import { geminiClient } from './gemini';
import { mistralClient } from './mistral';
import { deepseekClient } from './deepseek';
import { groqClient } from './groq';
import { openrouterClient } from './openrouter';
import { ollamaClient } from './ollama';
import { getApiKey } from '$lib/stores/apiKeyStore';

const clients: Record<ModelProvider, ModelClient> = {
	openai: openaiClient,
	anthropic: anthropicClient,
	gemini: geminiClient,
	mistral: mistralClient,
	deepseek: deepseekClient,
	groq: groqClient,
	openrouter: openrouterClient,
	ollama: ollamaClient
};

/** Send a message to the appropriate model */
export async function routeMessage(payload: ModelRequestPayload): Promise<ModelResponse> {
	const client = clients[payload.provider];
	if (!client) throw new Error(`Proveedor desconocido: ${payload.provider}`);

	const apiKey = getApiKey(payload.provider) ?? '';
	if (!apiKey && payload.provider !== 'ollama') {
		throw new Error(`No hay API key configurada para ${payload.provider}. Ve a Configuración para añadirla.`);
	}

	return client.send(payload, apiKey);
}

/** Active abort controller for the current streaming request */
let activeAbortController: AbortController | null = null;

/** Abort any in-progress streaming request */
export function abortActiveRequest() {
	if (activeAbortController) {
		activeAbortController.abort();
		activeAbortController = null;
	}
}

/** Send a streaming message to the appropriate model */
export async function routeMessageStream(
	payload: ModelRequestPayload,
	onChunk: (text: string) => void
): Promise<ModelResponse> {
	// Abort any previous request
	abortActiveRequest();
	activeAbortController = new AbortController();

	const client = clients[payload.provider];
	if (!client) throw new Error(`Proveedor desconocido: ${payload.provider}`);

	const apiKey = getApiKey(payload.provider) ?? '';
	if (!apiKey && payload.provider !== 'ollama') {
		throw new Error(`No hay API key configurada para ${payload.provider}. Ve a Configuración para añadirla.`);
	}

	const signal = activeAbortController.signal;

	try {
		if (client.sendStream) {
			return await client.sendStream(payload, apiKey, onChunk, signal);
		}
		return await client.send(payload, apiKey, signal);
	} finally {
		activeAbortController = null;
	}
}

/** Independent streaming — each call gets its own AbortController (for comparator) */
export async function routeMessageStreamIndependent(
	payload: ModelRequestPayload,
	onChunk: (text: string) => void,
	externalSignal?: AbortSignal
): Promise<ModelResponse> {
	const client = clients[payload.provider];
	if (!client) throw new Error(`Proveedor desconocido: ${payload.provider}`);

	const apiKey = getApiKey(payload.provider) ?? '';
	if (!apiKey && payload.provider !== 'ollama') {
		throw new Error(`No hay API key configurada para ${payload.provider}. Ve a Configuración para añadirla.`);
	}

	const controller = new AbortController();
	if (externalSignal) {
		externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
	}

	try {
		if (client.sendStream) {
			return await client.sendStream(payload, apiKey, onChunk, controller.signal);
		}
		return await client.send(payload, apiKey, controller.signal);
	} finally {
		// no shared state to clean up
	}
}

/** Get an available client */
export function getClient(provider: ModelProvider): ModelClient {
	return clients[provider];
}
