import { describe, it, expect } from 'vitest';
import { MODEL_REGISTRY, getModelDef, getProviders } from '$lib/models/registry';

describe('MODEL_REGISTRY', () => {
	it('contains at least 8 models', () => {
		expect(MODEL_REGISTRY.length).toBeGreaterThanOrEqual(8);
	});

	it('each model has required fields', () => {
		for (const model of MODEL_REGISTRY) {
			expect(model.id).toBeTruthy();
			expect(model.name).toBeTruthy();
			expect(model.provider).toBeTruthy();
			expect(model.alias).toBeTruthy();
			expect(model.capabilities.length).toBeGreaterThan(0);
			expect(['fast', 'medium', 'slow']).toContain(model.speed);
			expect(['free', 'low', 'medium', 'high']).toContain(model.costTier);
			expect(model.color).toBeTruthy();
		}
	});

	it('has unique IDs', () => {
		const ids = MODEL_REGISTRY.map(m => m.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('has unique aliases', () => {
		const aliases = MODEL_REGISTRY.map(m => m.alias);
		expect(new Set(aliases).size).toBe(aliases.length);
	});
});

describe('getModelDef', () => {
	it('finds model by ID', () => {
		const model = getModelDef('gpt-4o');
		expect(model).toBeDefined();
		expect(model?.name).toContain('GPT');
	});

	it('finds model by alias', () => {
		const model = getModelDef('gpt4o');
		expect(model).toBeDefined();
	});

	it('returns undefined for unknown model', () => {
		expect(getModelDef('nonexistent')).toBeUndefined();
	});
});

describe('getProviders', () => {
	it('returns unique provider list', () => {
		const providers = getProviders();
		expect(providers.length).toBeGreaterThan(0);
		expect(new Set(providers).size).toBe(providers.length);
	});
});
