import '@testing-library/jest-dom/vitest';

// Mock IndexedDB
const stores: Record<string, Record<string, unknown>> = {};

const mockObjectStore = (name: string) => {
	if (!stores[name]) stores[name] = {};
	return {
		put: (value: unknown, key?: string) => {
			const k = key ?? (value as Record<string, string>).id ?? 'default';
			stores[name][k] = value;
			return { onsuccess: null, onerror: null };
		},
		get: (key: string) => {
			const req = { result: stores[name][key], onsuccess: null as (() => void) | null, onerror: null };
			setTimeout(() => req.onsuccess?.(), 0);
			return req;
		},
		getAll: () => {
			const req = { result: Object.values(stores[name]), onsuccess: null as (() => void) | null, onerror: null };
			setTimeout(() => req.onsuccess?.(), 0);
			return req;
		},
		delete: (key: string) => {
			delete stores[name][key];
			return { onsuccess: null, onerror: null };
		},
		clear: () => {
			stores[name] = {};
			return { onsuccess: null, onerror: null };
		}
	};
};

const mockTransaction = (storeNames: string | string[]) => {
	const names = Array.isArray(storeNames) ? storeNames : [storeNames];
	return {
		objectStore: (name: string) => mockObjectStore(name),
		oncomplete: null as (() => void) | null,
		onerror: null,
		onabort: null,
		done: Promise.resolve()
	};
};

const mockDB = {
	transaction: mockTransaction,
	objectStoreNames: { contains: () => true },
	createObjectStore: () => mockObjectStore('mock')
};

// Mock indexedDB for tests
globalThis.indexedDB = {
	open: () => {
		const req = {
			result: mockDB,
			onsuccess: null as (() => void) | null,
			onerror: null as (() => void) | null,
			onupgradeneeded: null as (() => void) | null
		};
		setTimeout(() => {
			(req.onupgradeneeded as (() => void) | null)?.();
			req.onsuccess?.();
		}, 0);
		return req;
	}
} as unknown as IDBFactory;

// Mock localStorage
const localStore: Record<string, string> = {};
globalThis.localStorage = {
	getItem: (key: string) => localStore[key] ?? null,
	setItem: (key: string, value: string) => { localStore[key] = value; },
	removeItem: (key: string) => { delete localStore[key]; },
	clear: () => { Object.keys(localStore).forEach(k => delete localStore[k]); },
	get length() { return Object.keys(localStore).length; },
	key: (index: number) => Object.keys(localStore)[index] ?? null
};
