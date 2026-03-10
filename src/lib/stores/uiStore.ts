import { writable } from 'svelte/store';
import type { AvatarState, ModelProvider } from '$lib/types';

export const avatarState = writable<AvatarState>('idle');
export const selectedModel = writable<string>('gpt-4o');
export const selectedProvider = writable<ModelProvider>('openai');
