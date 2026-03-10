/** Store for saved/favorite user prompts — persisted in localStorage */
import { writable, get } from 'svelte/store';

export interface SavedPrompt {
	id: string;
	text: string;
	label: string;
	createdAt: number;
}

const STORAGE_KEY = 'myia_saved_prompts';

function loadPrompts(): SavedPrompt[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function persist(prompts: SavedPrompt[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export const savedPrompts = writable<SavedPrompt[]>(loadPrompts());

export function addPrompt(text: string, label?: string) {
	const prompt: SavedPrompt = {
		id: crypto.randomUUID(),
		text,
		label: label || text.slice(0, 40),
		createdAt: Date.now()
	};
	savedPrompts.update((list) => {
		const next = [prompt, ...list];
		persist(next);
		return next;
	});
}

export function removePrompt(id: string) {
	savedPrompts.update((list) => {
		const next = list.filter((p) => p.id !== id);
		persist(next);
		return next;
	});
}

export function getPrompts(): SavedPrompt[] {
	return get(savedPrompts);
}
