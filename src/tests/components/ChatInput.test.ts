import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ChatInput from '$lib/components/ChatInput.svelte';
import { setLocale } from '$lib/stores/i18nStore';

describe('ChatInput', () => {
	beforeEach(() => {
		setLocale('es');
	});

	it('renders with region role and label', () => {
		render(ChatInput);
		const region = screen.getByRole('region');
		expect(region).toBeInTheDocument();
		expect(region).toHaveAttribute('aria-label', 'Área de entrada de mensaje');
	});

	it('renders textarea with aria-label', () => {
		render(ChatInput);
		const textarea = screen.getByLabelText('Mensaje de chat');
		expect(textarea).toBeInTheDocument();
		expect(textarea.tagName.toLowerCase()).toBe('textarea');
	});

	it('renders send button with aria-label', () => {
		render(ChatInput);
		const btn = screen.getByLabelText('Enviar mensaje');
		expect(btn).toBeInTheDocument();
	});

	it('renders file upload label with aria-label', () => {
		render(ChatInput);
		const label = screen.getByLabelText('Adjuntar archivos');
		expect(label).toBeInTheDocument();
	});

	it('send button is disabled when textarea is empty', () => {
		render(ChatInput);
		const btn = screen.getByLabelText('Enviar mensaje');
		expect(btn).toBeDisabled();
	});

	it('send button enables when text is entered', async () => {
		render(ChatInput);
		const textarea = screen.getByLabelText('Mensaje de chat');
		await fireEvent.input(textarea, { target: { value: 'Hello' } });
		const btn = screen.getByLabelText('Enviar mensaje');
		expect(btn).not.toBeDisabled();
	});

	it('disables input when disabled prop is true', () => {
		render(ChatInput, { props: { disabled: true } });
		const textarea = screen.getByLabelText('Mensaje de chat');
		expect(textarea).toBeDisabled();
	});
});
