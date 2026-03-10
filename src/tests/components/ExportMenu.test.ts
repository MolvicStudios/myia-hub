import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ExportMenu from '$lib/components/ExportMenu.svelte';
import { setLocale } from '$lib/stores/i18nStore';
import type { Chat } from '$lib/types';

const mockChat: Chat = {
	id: 'test-1',
	title: 'Test Chat',
	model: 'gpt-4o',
	provider: 'openai',
	messages: [
		{ id: 'm1', role: 'user', content: 'Hello', timestamp: Date.now() }
	],
	createdAt: Date.now(),
	updatedAt: Date.now()
};

describe('ExportMenu', () => {
	beforeEach(() => {
		setLocale('es');
	});
	it('renders nothing when closed', () => {
		render(ExportMenu, { props: { chat: mockChat, open: false } });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders dialog when open', () => {
		render(ExportMenu, { props: { chat: mockChat, open: true } });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('shows export format buttons', () => {
		render(ExportMenu, { props: { chat: mockChat, open: true } });
		expect(screen.getByText('JSON')).toBeInTheDocument();
		expect(screen.getByText('Markdown')).toBeInTheDocument();
	});

	it('shows chat title', () => {
		render(ExportMenu, { props: { chat: mockChat, open: true } });
		expect(screen.getByText('"Test Chat"')).toBeInTheDocument();
	});

	it('shows cancel button', () => {
		render(ExportMenu, { props: { chat: mockChat, open: true } });
		expect(screen.getByText('Cancelar')).toBeInTheDocument();
	});
});
