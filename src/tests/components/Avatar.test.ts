import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Avatar from '$lib/components/Avatar.svelte';

describe('Avatar', () => {
	it('renders with correct ARIA role and label', () => {
		render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'idle' } });
		const avatar = screen.getByRole('img');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveAttribute('aria-label');
		expect(avatar.getAttribute('aria-label')).toContain('openai');
		expect(avatar.getAttribute('aria-label')).toContain('listo');
	});

	it('shows loading state in aria-label', () => {
		render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'loading' } });
		const avatar = screen.getByRole('img');
		expect(avatar.getAttribute('aria-label')).toContain('cargando');
	});

	it('shows typing state in aria-label', () => {
		render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'typing' } });
		const avatar = screen.getByRole('img');
		expect(avatar.getAttribute('aria-label')).toContain('escribiendo');
	});

	it('shows error state in aria-label', () => {
		render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'error' } });
		const avatar = screen.getByRole('img');
		expect(avatar.getAttribute('aria-label')).toContain('error');
	});

	it('renders with different sizes', () => {
		const { container: c1 } = render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'idle', size: 'sm' } });
		expect(c1.querySelector('.w-8')).toBeInTheDocument();
	});

	it('renders the provider icon', () => {
		render(Avatar, { props: { model: 'gpt-4o', provider: 'openai', state: 'idle' } });
		const avatar = screen.getByRole('img');
		expect(avatar.textContent).toContain('✦');
	});
});
