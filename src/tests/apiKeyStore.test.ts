import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { apiKeys, saveApiKey, getApiKey, removeApiKey, validateKeyFormat } from '$lib/stores/apiKeyStore';

describe('apiKeyStore', () => {
	beforeEach(() => {
		localStorage.clear();
		apiKeys.set([]);
	});

	it('starts with empty keys', () => {
		expect(get(apiKeys)).toHaveLength(0);
	});

	it('saves and retrieves an API key', () => {
		saveApiKey('openai', 'sk-test1234567890abcdef');
		const key = getApiKey('openai');
		expect(key).toBe('sk-test1234567890abcdef');
	});

	it('updates existing key for same provider', () => {
		saveApiKey('openai', 'sk-first');
		saveApiKey('openai', 'sk-second');
		expect(get(apiKeys).filter(k => k.provider === 'openai')).toHaveLength(1);
		expect(getApiKey('openai')).toBe('sk-second');
	});

	it('removes a key', () => {
		saveApiKey('openai', 'sk-test123');
		removeApiKey('openai');
		expect(getApiKey('openai')).toBeNull();
	});

	it('returns null for non-existent provider', () => {
		expect(getApiKey('anthropic')).toBeNull();
	});

	it('persists keys to localStorage', () => {
		saveApiKey('gemini', 'some-long-api-key-here-0000');
		const stored = JSON.parse(localStorage.getItem('myia_apikeys') ?? '[]');
		expect(stored).toHaveLength(1);
		expect(stored[0].provider).toBe('gemini');
	});
});

describe('validateKeyFormat', () => {
	it('validates OpenAI key format', () => {
		expect(validateKeyFormat('openai', 'sk-abcdefghijklmnopqrstuvwxyz')).toBe(true);
		expect(validateKeyFormat('openai', 'bad')).toBe(false);
	});

	it('validates Anthropic key format', () => {
		expect(validateKeyFormat('anthropic', 'sk-ant-abcdefghijklmnopqrstuvwxyz')).toBe(true);
		expect(validateKeyFormat('anthropic', 'sk-wrong')).toBe(false);
	});

	it('validates Groq key format', () => {
		expect(validateKeyFormat('groq', 'gsk_abcdefghijklmnopqrstuvwxyz')).toBe(true);
		expect(validateKeyFormat('groq', 'wrong')).toBe(false);
	});

	it('allows any string for Ollama (local)', () => {
		expect(validateKeyFormat('ollama', 'http://localhost:11434')).toBe(true);
	});
});
