/**
 * Mention parser — detects @model mentions in user input.
 * Supports multiple mentions: "@claude resumen @gpt4o traduce"
 */
import type { Mention, ParsedInput, ModelProvider } from '$lib/types';
import { MODEL_REGISTRY, getModelDef } from '$lib/models/registry';

/** Regex that matches @alias (supports hyphens for aliases like mistral-local) */
const MENTION_RE = /@([\w-]+)/g;

/** Parse user input for @mentions */
export function parseMentions(raw: string, defaultModel: string | null): ParsedInput {
	const mentions: Mention[] = [];
	const matches = [...raw.matchAll(MENTION_RE)];

	if (matches.length === 0) {
		return { raw, cleanText: raw.trim(), mentions: [], defaultModel };
	}

	// Extract mentions and split text
	let remaining = raw;
	for (const match of matches) {
		const alias = match[1].toLowerCase();
		const model = getModelDef(alias);
		if (model) {
			mentions.push({
				model: model.id,
				provider: model.provider,
				alias: model.alias,
				text: '' // will be filled below
			});
			remaining = remaining.replace(match[0], '').trim();
		}
	}

	// If only one mention, assign all text to it
	if (mentions.length === 1) {
		mentions[0].text = remaining;
	} else if (mentions.length > 1) {
		// Split text between mentions based on position
		const segments = splitByMentions(raw, mentions);
		for (let i = 0; i < mentions.length; i++) {
			mentions[i].text = segments[i] || remaining;
		}
	}

	return {
		raw,
		cleanText: remaining,
		mentions,
		defaultModel: mentions.length > 0 ? mentions[0].model : defaultModel
	};
}

/** Split text into segments assigned to each mention */
function splitByMentions(raw: string, mentions: Mention[]): string[] {
	const parts: string[] = [];
	let text = raw;

	for (let i = 0; i < mentions.length; i++) {
		const pattern = `@${mentions[i].alias}`;
		const idx = text.toLowerCase().indexOf(pattern.toLowerCase());
		if (idx === -1) {
			parts.push(text.trim());
			continue;
		}

		// Text after this mention until next mention
		const afterMention = text.slice(idx + pattern.length);
		const nextMentionIdx =
			i < mentions.length - 1
				? afterMention.toLowerCase().indexOf(`@${mentions[i + 1].alias}`.toLowerCase())
				: -1;

		if (nextMentionIdx === -1) {
			parts.push(afterMention.trim());
		} else {
			parts.push(afterMention.slice(0, nextMentionIdx).trim());
		}
		text = afterMention;
	}

	return parts;
}

/** Get model suggestions for autocomplete */
export function getModelSuggestions(partial: string): typeof MODEL_REGISTRY {
	const lower = partial.toLowerCase();
	return MODEL_REGISTRY.filter(
		(m) =>
			m.alias.startsWith(lower) ||
			m.name.toLowerCase().includes(lower) ||
			m.id.toLowerCase().includes(lower)
	);
}

/** Check if cursor is in a mention context (after @) */
export function isInMentionContext(text: string, cursorPos: number): { active: boolean; query: string } {
	const before = text.slice(0, cursorPos);
	const match = before.match(/@([\w-]*)$/);
	if (match) {
		return { active: true, query: match[1] };
	}
	return { active: false, query: '' };
}
