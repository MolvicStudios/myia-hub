/**
 * Model Router — central dispatch for all model requests.
 * Resolves the correct client for a provider and forwards the request.
 * Providers are lazily loaded on first use to reduce initial bundle size.
 */
import type { ModelProvider, ModelRequestPayload, ModelResponse } from '$lib/types';
import type { ModelClient } from './base';
import { getApiKey } from '$lib/stores/apiKeyStore';

const clientCache: Partial<Record<ModelProvider, ModelClient>> = {};

/** Lazily load and cache the provider client */
async function getClient(provider: ModelProvider): Promise<ModelClient> {
	if (clientCache[provider]) return clientCache[provider]!;
	let mod: { [key: string]: ModelClient };
	switch (provider) {
		case 'openai':     mod = await import('./openai'); clientCache[provider] = mod.openaiClient; break;
		case 'anthropic':  mod = await import('./anthropic'); clientCache[provider] = mod.anthropicClient; break;
		case 'gemini':     mod = await import('./gemini'); clientCache[provider] = mod.geminiClient; break;
		case 'mistral':    mod = await import('./mistral'); clientCache[provider] = mod.mistralClient; break;
		case 'deepseek':   mod = await import('./deepseek'); clientCache[provider] = mod.deepseekClient; break;
		case 'groq':       mod = await import('./groq'); clientCache[provider] = mod.groqClient; break;
		case 'openrouter': mod = await import('./openrouter'); clientCache[provider] = mod.openrouterClient; break;
		case 'ollama':     mod = await import('./ollama'); clientCache[provider] = mod.ollamaClient; break;
		default: throw new Error(`Proveedor desconocido: ${provider}`);
	}
	return clientCache[provider]!;
}

/** Send a message to the appropriate model */
export async function routeMessage(payload: ModelRequestPayload): Promise<ModelResponse> {
	const client = await getClient(payload.provider);

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

	const client = await getClient(payload.provider);

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
	const client = await getClient(payload.provider);

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
