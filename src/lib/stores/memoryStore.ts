import { writable, get } from 'svelte/store';
import type { ChatMessage } from '$lib/types';
import { putInStore, deleteFromStore, clearStore, getAllFromStore } from '$lib/utils/idb';

const MEMORY_LIMIT = 20; // max messages per model to remember

export interface ModelMemory {
	modelId: string;
	messages: ChatMessage[];
	updatedAt: number;
}

export const memoryStore = writable<Record<string, ModelMemory>>({});

/** Save memory for a model */
export async function saveMemory(modelId: string, messages: ChatMessage[]) {
	const trimmed = messages.slice(-MEMORY_LIMIT);
	const entry: ModelMemory = { modelId, messages: trimmed, updatedAt: Date.now() };

	memoryStore.update((m) => ({ ...m, [modelId]: entry }));

	try {
		await putInStore('memory', entry, modelId);
	} catch { /* ignore */ }
}

/** Load memory for a model */
export async function loadMemory(modelId: string): Promise<ChatMessage[]> {
	// Check store first
	const cached = get(memoryStore)[modelId];
	if (cached) return cached.messages;

	try {
		const all = await getAllFromStore<ModelMemory>('memory');
		const entry = all.find((e) => e.modelId === modelId);
		if (entry) {
			memoryStore.update((m) => ({ ...m, [modelId]: entry }));
			return entry.messages;
		}
	} catch { /* ignore */ }
	return [];
}

/** Clear memory for a model */
export async function clearMemory(modelId: string) {
	memoryStore.update((m) => {
		const copy = { ...m };
		delete copy[modelId];
		return copy;
	});

	try {
		await deleteFromStore('memory', modelId);
	} catch { /* ignore */ }
}

/** Clear all memory */
export async function clearAllMemory() {
	memoryStore.set({});
	try {
		await clearStore('memory');
	} catch { /* ignore */ }
}
