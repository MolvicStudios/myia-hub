import type { ModelDef } from '$lib/types';

/** Registry of all supported models */
export const MODEL_REGISTRY: ModelDef[] = [
	// OpenAI
	{
		id: 'gpt-4.1',
		name: 'GPT-4.1',
		provider: 'openai',
		alias: 'gpt4',
		capabilities: ['text', 'image', 'code'],
		speed: 'medium',
		costTier: 'high',
		color: '#10a37f',
		icon: '🟢',
		maxTokens: 32768
	},
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		provider: 'openai',
		alias: 'gpt4o',
		capabilities: ['text', 'image', 'audio', 'code'],
		speed: 'fast',
		costTier: 'medium',
		color: '#10a37f',
		icon: '🟢',
		maxTokens: 128000
	},
	// Anthropic
	{
		id: 'claude-sonnet-4-20250514',
		name: 'Claude Sonnet 4',
		provider: 'anthropic',
		alias: 'claude',
		capabilities: ['text', 'image', 'code'],
		speed: 'fast',
		costTier: 'medium',
		color: '#d97706',
		icon: '🟠',
		maxTokens: 200000
	},
	{
		id: 'claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		alias: 'sonnet',
		capabilities: ['text', 'image', 'code'],
		speed: 'fast',
		costTier: 'medium',
		color: '#d97706',
		icon: '🟠',
		maxTokens: 200000
	},
	// Google Gemini
	{
		id: 'gemini-2.0-flash',
		name: 'Gemini 2.0 Flash',
		provider: 'gemini',
		alias: 'gemini',
		capabilities: ['text', 'image', 'code'],
		speed: 'fast',
		costTier: 'low',
		color: '#4285f4',
		icon: '🔵',
		maxTokens: 1048576
	},
	// Mistral
	{
		id: 'mistral-large-latest',
		name: 'Mistral Large',
		provider: 'mistral',
		alias: 'mistral',
		capabilities: ['text', 'code'],
		speed: 'fast',
		costTier: 'medium',
		color: '#ff7000',
		icon: '🟧',
		maxTokens: 32768
	},
	// DeepSeek
	{
		id: 'deepseek-chat',
		name: 'DeepSeek Chat',
		provider: 'deepseek',
		alias: 'deepseek',
		capabilities: ['text', 'code'],
		speed: 'fast',
		costTier: 'low',
		color: '#5b6abf',
		icon: '🔮',
		maxTokens: 32768
	},
	// Groq
	{
		id: 'llama-3.3-70b-versatile',
		name: 'Llama 3.3 70B (Groq)',
		provider: 'groq',
		alias: 'groq',
		capabilities: ['text', 'code'],
		speed: 'fast',
		costTier: 'free',
		color: '#f55036',
		icon: '🔴',
		maxTokens: 32768
	},
	// OpenRouter
	{
		id: 'openrouter/auto',
		name: 'OpenRouter Auto',
		provider: 'openrouter',
		alias: 'openrouter',
		capabilities: ['text', 'image', 'code'],
		speed: 'medium',
		costTier: 'medium',
		color: '#8b5cf6',
		icon: '🟣',
		maxTokens: 32768
	},
	// Ollama (local)
	{
		id: 'llama3',
		name: 'Llama 3 (Ollama)',
		provider: 'ollama',
		alias: 'ollama',
		capabilities: ['text', 'code'],
		speed: 'medium',
		costTier: 'free',
		color: '#1e88e5',
		icon: '🦙',
		maxTokens: 8192
	}
];

/** Get a model definition by id or alias */
export function getModelDef(idOrAlias: string): ModelDef | undefined {
	const lower = idOrAlias.toLowerCase();
	return MODEL_REGISTRY.find(
		(m) => m.id === lower || m.alias === lower || m.name.toLowerCase() === lower
	);
}

/** Get all unique providers */
export function getProviders(): string[] {
	return [...new Set(MODEL_REGISTRY.map((m) => m.provider))];
}
