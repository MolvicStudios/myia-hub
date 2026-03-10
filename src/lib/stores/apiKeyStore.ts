import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { ApiKeyEntry, ModelProvider } from '$lib/types';

const STORAGE_KEY = 'myia_apikeys';

/** Simple XOR-based obfuscation (NOT real encryption — keys stay local) */
function obfuscate(text: string, key = 'myia-salt-2024'): string {
	return btoa(
		text
			.split('')
			.map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
			.join('')
	);
}

function deobfuscate(encoded: string, key = 'myia-salt-2024'): string {
	const decoded = atob(encoded);
	return decoded
		.split('')
		.map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
		.join('');
}

function loadKeys(): ApiKeyEntry[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch { /* ignore */ }
	return [];
}

export const apiKeys = writable<ApiKeyEntry[]>(loadKeys());

// Persist on change
apiKeys.subscribe(($keys) => {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify($keys));
	} catch { /* ignore */ }
});

/** Save an API key for a provider */
export function saveApiKey(provider: ModelProvider, rawKey: string) {
	const entry: ApiKeyEntry = {
		provider,
		key: obfuscate(rawKey),
		valid: rawKey.length > 10,
		addedAt: Date.now()
	};
	apiKeys.update((keys) => {
		const filtered = keys.filter((k) => k.provider !== provider);
		return [...filtered, entry];
	});
}

/** Get decrypted API key for a provider */
export function getApiKey(provider: ModelProvider): string | null {
	// Re-read from localStorage on client if store is empty (handles SSR → client hydration)
	if (browser) {
		const current = get(apiKeys);
		if (current.length === 0) {
			const fresh = loadKeys();
			if (fresh.length > 0) apiKeys.set(fresh);
		}
	}
	const entry = get(apiKeys).find((k) => k.provider === provider);
	if (!entry) return null;
	try {
		return deobfuscate(entry.key);
	} catch {
		return null;
	}
}

/** Remove an API key */
export function removeApiKey(provider: ModelProvider) {
	apiKeys.update((keys) => keys.filter((k) => k.provider !== provider));
}

/** Validate key format for each provider */
export function validateKeyFormat(provider: ModelProvider, key: string): boolean {
	const patterns: Partial<Record<ModelProvider, RegExp>> = {
		openai: /^sk-[a-zA-Z0-9_-]{20,}$/,
		anthropic: /^sk-ant-[a-zA-Z0-9_-]{20,}$/,
		gemini: /^[a-zA-Z0-9_-]{30,}$/,
		mistral: /^[a-zA-Z0-9_-]{20,}$/,
		deepseek: /^sk-[a-zA-Z0-9_-]{20,}$/,
		groq: /^gsk_[a-zA-Z0-9_-]{20,}$/,
		openrouter: /^sk-or-[a-zA-Z0-9_-]{20,}$/
	};
	const pattern = patterns[provider];
	if (!pattern) return key.length > 5; // Ollama doesn't need a key
	return pattern.test(key);
}
