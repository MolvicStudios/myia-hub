import { writable, derived, get } from 'svelte/store';
import type { Chat, ChatMessage, ModelProvider } from '$lib/types';
import { getAllFromStore, putInStore, clearStore } from '$lib/utils/idb';

let persistTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced persistence — coalesces rapid updates (e.g. streaming) */
function schedulePersist() {
	if (persistTimer) clearTimeout(persistTimer);
	persistTimer = setTimeout(persistChats, 500);
}

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function generateTitle(messages: ChatMessage[]): string {
	const first = messages.find((m) => m.role === 'user');
	if (!first) return 'Nuevo chat';
	return first.content.slice(0, 50) + (first.content.length > 50 ? '…' : '');
}

/** All chats */
export const chats = writable<Chat[]>([]);

/** ID of the currently active chat */
export const activeChatId = writable<string | null>(null);

/** Derived: current active chat */
export const activeChat = derived([chats, activeChatId], ([$chats, $id]) =>
	$chats.find((c) => c.id === $id) ?? null
);

/** Derived: messages of the active chat */
export const activeMessages = derived(activeChat, ($chat) => $chat?.messages ?? []);

/** Create a new chat */
export function createChat(model: string, provider: ModelProvider): string {
	const id = generateId();
	const chat: Chat = {
		id,
		title: 'Nuevo chat',
		model,
		provider,
		messages: [],
		createdAt: Date.now(),
		updatedAt: Date.now()
	};
	chats.update((list) => [chat, ...list]);
	activeChatId.set(id);
	persistChats();
	return id;
}

/** Add a message to the active chat */
export function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
	const msg: ChatMessage = {
		...message,
		id: generateId(),
		timestamp: Date.now()
	};
	chats.update((list) =>
		list.map((c) => {
			if (c.id !== get(activeChatId)) return c;
			const messages = [...c.messages, msg];
			return {
				...c,
				messages,
				title: c.messages.length === 0 ? generateTitle(messages) : c.title,
				updatedAt: Date.now()
			};
		})
	);
	persistChats();
	return msg;
}

/** Update the last assistant message (for streaming) */
export function updateLastAssistantMessage(content: string) {
	chats.update((list) =>
		list.map((c) => {
			if (c.id !== get(activeChatId)) return c;
			const messages = [...c.messages];
			for (let i = messages.length - 1; i >= 0; i--) {
				if (messages[i].role === 'assistant') {
					messages[i] = { ...messages[i], content };
					break;
				}
			}
			return { ...c, messages, updatedAt: Date.now() };
		})
	);
	schedulePersist();
}

/** Rename a chat */
export function renameChat(chatId: string, title: string) {
	chats.update((list) =>
		list.map((c) => (c.id === chatId ? { ...c, title, updatedAt: Date.now() } : c))
	);
	persistChats();
}

/** Delete a chat */
export function deleteChat(chatId: string) {
	chats.update((list) => list.filter((c) => c.id !== chatId));
	const $active = get(activeChatId);
	if ($active === chatId) {
		const remaining = get(chats);
		activeChatId.set(remaining.length > 0 ? remaining[0].id : null);
	}
	persistChats();
}

/** Persist chats to IndexedDB */
async function persistChats() {
	try {
		await clearStore('chats');
		for (const chat of get(chats)) {
			await putInStore('chats', chat);
		}
	} catch {
		// Fallback: localStorage
		try {
			localStorage.setItem('myia_chats', JSON.stringify(get(chats)));
		} catch { /* storage full */ }
	}
}

/** Load chats from IndexedDB */
export async function loadChats() {
	try {
		const all = await getAllFromStore<Chat>('chats');
		// Remove empty chats (no messages) on load
		const valid = all.filter((c) => c.messages.length > 0);
		const sorted = valid.sort((a, b) => b.updatedAt - a.updatedAt);
		chats.set(sorted);
		if (sorted.length > 0) {
			activeChatId.set(sorted[0].id);
		}
		// Persist cleaned list if we removed any
		if (valid.length < all.length) {
			persistChats();
		}
	} catch {
		// Fallback: localStorage
		try {
			const raw = localStorage.getItem('myia_chats');
			if (raw) {
				const parsed = JSON.parse(raw) as Chat[];
				chats.set(parsed);
				if (parsed.length > 0) activeChatId.set(parsed[0].id);
			}
		} catch { /* ignore */ }
	}
}
