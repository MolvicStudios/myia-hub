import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { settings, updateSetting, toggleSidebar, toggleTheme } from '$lib/stores/settingsStore';

describe('settingsStore', () => {
	beforeEach(() => {
		localStorage.clear();
		settings.set({
			theme: 'dark',
			defaultModel: 'gpt-4o',
			memoryEnabled: true,
			memoryPerModel: {},
			sidebarOpen: true
		});
	});

	it('has correct default values', () => {
		const s = get(settings);
		expect(s.theme).toBe('dark');
		expect(s.defaultModel).toBe('gpt-4o');
		expect(s.memoryEnabled).toBe(true);
		expect(s.sidebarOpen).toBe(true);
	});

	it('updates a single setting', () => {
		updateSetting('defaultModel', 'claude-3-sonnet');
		expect(get(settings).defaultModel).toBe('claude-3-sonnet');
	});

	it('toggles sidebar', () => {
		expect(get(settings).sidebarOpen).toBe(true);
		toggleSidebar();
		expect(get(settings).sidebarOpen).toBe(false);
		toggleSidebar();
		expect(get(settings).sidebarOpen).toBe(true);
	});

	it('toggles theme', () => {
		expect(get(settings).theme).toBe('dark');
		toggleTheme();
		expect(get(settings).theme).toBe('light');
		toggleTheme();
		expect(get(settings).theme).toBe('solarized');
		toggleTheme();
		expect(get(settings).theme).toBe('nord');
		toggleTheme();
		expect(get(settings).theme).toBe('dark');
	});

	it('persists settings to localStorage', () => {
		updateSetting('memoryEnabled', false);
		const stored = JSON.parse(localStorage.getItem('myia_settings') ?? '{}');
		expect(stored.memoryEnabled).toBe(false);
	});
});
