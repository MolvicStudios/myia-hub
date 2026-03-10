import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatusIndicator from '$lib/components/StatusIndicator.svelte';
import { setLocale } from '$lib/stores/i18nStore';

describe('StatusIndicator', () => {
	beforeEach(() => {
		setLocale('es');
	});

	it('renders with status role and aria-live', () => {
		render(StatusIndicator, { props: { state: 'idle', model: 'gpt-4o', provider: 'openai' } });
		const indicator = screen.getByRole('status');
		expect(indicator).toBeInTheDocument();
		expect(indicator).toHaveAttribute('aria-live', 'polite');
	});

	it('shows model name in aria-label', () => {
		render(StatusIndicator, { props: { state: 'idle', model: 'gpt-4o', provider: 'openai' } });
		const indicator = screen.getByRole('status');
		expect(indicator.getAttribute('aria-label')).toContain('GPT-4o');
	});

	it('shows correct state label', () => {
		render(StatusIndicator, { props: { state: 'typing', model: 'gpt-4o', provider: 'openai' } });
		expect(screen.getByText('Escribiendo…')).toBeInTheDocument();
	});

	it('shows idle state label', () => {
		render(StatusIndicator, { props: { state: 'idle', model: 'gpt-4o', provider: 'openai' } });
		expect(screen.getByText('Listo')).toBeInTheDocument();
	});
});
