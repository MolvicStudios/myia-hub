import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ModelSelector from '$lib/components/ModelSelector.svelte';

describe('ModelSelector', () => {
	it('renders trigger button with model name', () => {
		render(ModelSelector);
		const btn = screen.getByRole('button', { name: /selector de modelo/i });
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveAttribute('aria-haspopup', 'listbox');
		expect(btn).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens dropdown on click', async () => {
		render(ModelSelector);
		const btn = screen.getByRole('button', { name: /selector de modelo/i });
		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('shows search input when open', async () => {
		render(ModelSelector);
		await fireEvent.click(screen.getByRole('button', { name: /selector de modelo/i }));
		const searchInput = screen.getByLabelText('Buscar modelo');
		expect(searchInput).toBeInTheDocument();
	});

	it('shows model options with role=option', async () => {
		render(ModelSelector);
		await fireEvent.click(screen.getByRole('button', { name: /selector de modelo/i }));
		const options = screen.getAllByRole('option');
		expect(options.length).toBeGreaterThan(0);
	});

	it('closes on Escape key', async () => {
		render(ModelSelector);
		const btn = screen.getByRole('button', { name: /selector de modelo/i });
		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-expanded', 'true');
		await fireEvent.keyDown(btn, { key: 'Escape' });
		expect(btn).toHaveAttribute('aria-expanded', 'false');
	});
});
