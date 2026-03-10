import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportAsJson, exportAsMarkdown } from '$lib/utils/exportUtils';
import type { Chat } from '$lib/types';

// Mock URL and DOM APIs
const mockClick = vi.fn();
const mockCreateElement = vi.fn(() => ({
	href: '',
	download: '',
	click: mockClick
}));

vi.stubGlobal('URL', {
	createObjectURL: vi.fn(() => 'blob:mock'),
	revokeObjectURL: vi.fn()
});

const mockChat: Chat = {
	id: 'test-1',
	title: 'Test Chat',
	model: 'gpt-4o',
	provider: 'openai',
	messages: [
		{ id: 'm1', role: 'user', content: 'Hello', timestamp: Date.now() },
		{ id: 'm2', role: 'assistant', content: 'Hi there!', model: 'GPT-4o', timestamp: Date.now() }
	],
	createdAt: Date.now(),
	updatedAt: Date.now()
};

describe('exportAsJson', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock document methods
		document.createElement = mockCreateElement as unknown as typeof document.createElement;
		document.body.appendChild = vi.fn();
		document.body.removeChild = vi.fn();
	});

	it('creates a downloadable JSON blob', () => {
		exportAsJson(mockChat);
		expect(URL.createObjectURL).toHaveBeenCalled();
		expect(mockClick).toHaveBeenCalled();
		expect(URL.revokeObjectURL).toHaveBeenCalled();
	});
});

describe('exportAsMarkdown', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.createElement = mockCreateElement as unknown as typeof document.createElement;
		document.body.appendChild = vi.fn();
		document.body.removeChild = vi.fn();
	});

	it('creates a downloadable Markdown blob', () => {
		exportAsMarkdown(mockChat);
		expect(URL.createObjectURL).toHaveBeenCalled();
		expect(mockClick).toHaveBeenCalled();
	});
});
