import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { chats, activeChatId, activeChat, activeMessages, createChat, addMessage, updateLastAssistantMessage, renameChat, deleteChat } from '$lib/stores/chatStore';

describe('chatStore', () => {
	beforeEach(() => {
		chats.set([]);
		activeChatId.set(null);
	});

	it('creates a new chat', () => {
		const id = createChat('gpt-4o', 'openai');
		expect(id).toBeTruthy();
		expect(get(chats)).toHaveLength(1);
		expect(get(activeChatId)).toBe(id);
	});

	it('creates chat with correct properties', () => {
		createChat('gpt-4o', 'openai');
		const chat = get(chats)[0];
		expect(chat.model).toBe('gpt-4o');
		expect(chat.provider).toBe('openai');
		expect(chat.title).toBe('Nuevo chat');
		expect(chat.messages).toHaveLength(0);
	});

	it('adds a message to the active chat', () => {
		createChat('gpt-4o', 'openai');
		const msg = addMessage({ role: 'user', content: 'Hello' });
		expect(msg.id).toBeTruthy();
		expect(msg.timestamp).toBeGreaterThan(0);
		expect(get(activeMessages)).toHaveLength(1);
		expect(get(activeMessages)[0].content).toBe('Hello');
	});

	it('auto-generates title from first user message', () => {
		createChat('gpt-4o', 'openai');
		addMessage({ role: 'user', content: 'What is the meaning of life?' });
		const chat = get(activeChat);
		expect(chat?.title).toContain('What is the meaning of life');
	});

	it('updates the last assistant message for streaming', () => {
		createChat('gpt-4o', 'openai');
		addMessage({ role: 'user', content: 'Hi' });
		addMessage({ role: 'assistant', content: '' });
		updateLastAssistantMessage('Hello back!');
		const msgs = get(activeMessages);
		expect(msgs[msgs.length - 1].content).toBe('Hello back!');
	});

	it('renames a chat', () => {
		const id = createChat('gpt-4o', 'openai');
		renameChat(id, 'My Custom Title');
		expect(get(chats)[0].title).toBe('My Custom Title');
	});

	it('deletes a chat', () => {
		const id = createChat('gpt-4o', 'openai');
		expect(get(chats)).toHaveLength(1);
		deleteChat(id);
		expect(get(chats)).toHaveLength(0);
	});

	it('clears activeChatId when deleting active chat', () => {
		const id = createChat('gpt-4o', 'openai');
		deleteChat(id);
		// activeChatId should be null or different
		const active = get(activeChatId);
		expect(active).not.toBe(id);
	});

	it('activeChat is null when no chat is active', () => {
		expect(get(activeChat)).toBeNull();
	});

	it('activeMessages is empty when no chat is active', () => {
		expect(get(activeMessages)).toEqual([]);
	});
});
