import { writable, get } from 'svelte/store';
import type { UserSettings } from '$lib/types';

const STORAGE_KEY = 'myia_settings';

const defaults: UserSettings = {
	theme: 'dark',
	defaultModel: 'gpt-4o',
	memoryEnabled: true,
	memoryPerModel: {},
	sidebarOpen: true
};

function loadSettings(): UserSettings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return { ...defaults, ...JSON.parse(raw) };
	} catch { /* ignore */ }
	return { ...defaults };
}

export const settings = writable<UserSettings>(loadSettings());

/** Persist settings to localStorage on every change */
settings.subscribe(($s) => {
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

/** Toggle theme */
export function toggleTheme() {
	settings.update((s) => ({
		...s,
		theme: s.theme === 'dark' ? 'light' : 'dark'
	}));
	const $s = get(settings);
	if (typeof document !== 'undefined') {
		document.documentElement.classList.toggle('dark', $s.theme === 'dark');
		document.documentElement.classList.toggle('light', $s.theme === 'light');
	}
}
