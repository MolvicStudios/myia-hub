/** Shared types for the MyIA Hub application */

export type ModelProvider =
	| 'openai'
	| 'anthropic'
	| 'gemini'
	| 'mistral'
	| 'deepseek'
	| 'groq'
	| 'openrouter'
	| 'ollama';

export type ModelCapability = 'text' | 'image' | 'audio' | 'file' | 'code';

export interface ModelDef {
	id: string;
	name: string;
	provider: ModelProvider;
	alias: string; // short name for @mentions
	capabilities: ModelCapability[];
	speed: 'fast' | 'medium' | 'slow';
	costTier: 'free' | 'low' | 'medium' | 'high';
	color: string;
	icon: string; // emoji or icon key
	maxTokens?: number;
}

export type AvatarState = 'idle' | 'loading' | 'typing' | 'error';

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	model?: string;
	provider?: ModelProvider;
	timestamp: number;
	attachments?: FileAttachment[];
	images?: string[]; // base64 or URLs
}

export interface FileAttachment {
	name: string;
	type: string;
	size: number;
	preview?: string; // base64 for images, text excerpt for text files
	data?: string; // base64
}

export interface Chat {
	id: string;
	title: string;
	model: string;
	provider: ModelProvider;
	messages: ChatMessage[];
	createdAt: number;
	updatedAt: number;
}

export interface Mention {
	model: string;
	provider: ModelProvider;
	alias: string;
	text: string; // text after the mention for this model
}

export interface ParsedInput {
	raw: string;
	cleanText: string;
	mentions: Mention[];
	defaultModel: string | null;
}

export interface ApiKeyEntry {
	provider: ModelProvider;
	key: string; // encrypted
	valid: boolean;
	addedAt: number;
}

export interface UserSettings {
	theme: 'dark' | 'light' | 'solarized' | 'nord';
	defaultModel: string;
	memoryEnabled: boolean;
	memoryPerModel: Record<string, boolean>;
	sidebarOpen: boolean;
}

export interface ModelRequestPayload {
	model: string;
	provider: ModelProvider;
	messages: { role: string; content: string }[];
	attachments?: FileAttachment[];
	maxTokens?: number;
	temperature?: number;
	stream?: boolean;
}

export interface ModelResponse {
	content: string;
	model: string;
	provider: ModelProvider;
	usage?: { promptTokens: number; completionTokens: number };
	images?: string[];
}
