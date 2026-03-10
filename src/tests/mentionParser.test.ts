import { describe, it, expect } from 'vitest';
import { parseMentions, getModelSuggestions, isInMentionContext } from '$lib/utils/mentionParser';

describe('parseMentions', () => {
	it('returns raw text with no mentions', () => {
		const result = parseMentions('Hello world', 'gpt-4o');
		expect(result.mentions).toHaveLength(0);
		expect(result.cleanText).toBe('Hello world');
		expect(result.defaultModel).toBe('gpt-4o');
	});

	it('detects a single model mention by alias', () => {
		const result = parseMentions('@gpt4o Explain this', 'gpt-4o');
		expect(result.mentions).toHaveLength(1);
		expect(result.mentions[0].model).toBe('gpt-4o');
		expect(result.mentions[0].text).toContain('Explain this');
	});

	it('detects multiple mentions', () => {
		const result = parseMentions('@claude summarize @gpt4o translate', null);
		expect(result.mentions.length).toBeGreaterThanOrEqual(2);
	});

	it('ignores unknown aliases', () => {
		const result = parseMentions('@unknown hello', null);
		expect(result.mentions).toHaveLength(0);
		expect(result.cleanText).toBe('@unknown hello');
	});

	it('handles empty input', () => {
		const result = parseMentions('', null);
		expect(result.mentions).toHaveLength(0);
		expect(result.cleanText).toBe('');
	});
});

describe('getModelSuggestions', () => {
	it('returns matching models for partial alias', () => {
		const results = getModelSuggestions('gpt');
		expect(results.length).toBeGreaterThan(0);
		expect(results.some(m => m.alias.startsWith('gpt'))).toBe(true);
	});

	it('returns all models for empty query', () => {
		const results = getModelSuggestions('');
		expect(results.length).toBeGreaterThan(0);
	});

	it('returns empty array for non-matching query', () => {
		const results = getModelSuggestions('zzzznonexistent');
		expect(results).toHaveLength(0);
	});

	it('matches by model name (case insensitive)', () => {
		const results = getModelSuggestions('claude');
		expect(results.length).toBeGreaterThan(0);
	});
});

describe('isInMentionContext', () => {
	it('detects cursor right after @', () => {
		const result = isInMentionContext('Hello @', 7);
		expect(result.active).toBe(true);
		expect(result.query).toBe('');
	});

	it('detects cursor after partial alias', () => {
		const result = isInMentionContext('Hello @gpt', 10);
		expect(result.active).toBe(true);
		expect(result.query).toBe('gpt');
	});

	it('not active when cursor is not in mention', () => {
		const result = isInMentionContext('Hello world', 5);
		expect(result.active).toBe(false);
	});

	it('not active after space following mention', () => {
		const result = isInMentionContext('@gpt4o ', 7);
		expect(result.active).toBe(false);
	});
});
