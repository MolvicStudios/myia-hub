import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { UserSettings } from '$lib/types';

const STORAGE_KEY = 'myia_settings';

const defaults: UserSettings = {
	theme: 'dark',
	defaultModel: 'gpt-4o',
	memoryEnabled: true,
	memoryPerModel: {},
	sidebarOpen: true,
	ollamaEnabled: false,
	ollamaEndpoint: 'http://localhost:11434'
};

function loadSettings(): UserSettings {
	if (!browser) return { ...defaults };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return { ...defaults, ...JSON.parse(raw) };
	} catch { /* ignore */ }
	return { ...defaults };
}

export const settings = writable<UserSettings>(loadSettings());

/** Persist settings to localStorage on every change */
settings.subscribe(($s) => {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify($s));
	} catch { /* storage full */ }
});

/** Update a single setting */
export function updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
	settings.update((s) => ({ ...s, [key]: value }));
}

/** Toggle sidebar */
export function toggleSidebar() {
	settings.update((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
}

/** Cycle through themes */
const THEMES: UserSettings['theme'][] = ['dark', 'light', 'solarized', 'nord'];

export function toggleTheme() {
	settings.update((s) => {
		const idx = THEMES.indexOf(s.theme);
		const next = THEMES[(idx + 1) % THEMES.length];
		return { ...s, theme: next };
	});
	applyTheme(get(settings).theme);
}

/** Set a specific theme */
export function setTheme(theme: UserSettings['theme']) {
	updateSetting('theme', theme);
	applyTheme(theme);
}

/** Apply theme class to document */
export function applyTheme(theme: string) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.remove('dark', 'light', 'solarized', 'nord');
	document.documentElement.classList.add(theme);
}
