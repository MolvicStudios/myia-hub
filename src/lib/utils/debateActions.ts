/**
 * Multi-model debate orchestrator.
 * Runs a sequential conversation between N models where each one
 * waits for the previous to finish and sees the full history.
 */
import { routeMessageStream } from '$lib/models/router';
import { getApiKey } from '$lib/stores/apiKeyStore';
import type { ModelProvider } from '$lib/types';

export interface DebateParticipant {
	modelId: string;
	name: string;
	provider: ModelProvider;
}

export interface DebateMessage {
	participant: DebateParticipant;
	content: string;
	round: number;
}

export interface DebateConfig {
	topic: string;
	participants: DebateParticipant[];
	rounds: number;
}

/** Default debate participants */
export const DEFAULT_PARTICIPANTS: DebateParticipant[] = [
	{ modelId: 'openrouter/auto', name: 'OpenRouter', provider: 'openrouter' },
	{ modelId: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral' },
	{ modelId: 'llama-3.3-70b-versatile', name: 'Groq (Llama 3.3)', provider: 'groq' }
];

/** Default debate topic */
export const DEFAULT_TOPIC =
	'¿Cuál será el mayor impacto de la IA en la sociedad en los próximos 5 años? ' +
	'Debatid entre vosotros, responded a los argumentos de los demás y defended vuestra postura.';

/** Check which participants have valid API keys */
export function getReadyParticipants(participants: DebateParticipant[]): {
	ready: DebateParticipant[];
	missing: DebateParticipant[];
} {
	const ready: DebateParticipant[] = [];
	const missing: DebateParticipant[] = [];
	for (const p of participants) {
		if (getApiKey(p.provider)) ready.push(p);
		else missing.push(p);
	}
	return { ready, missing };
}

/**
 * Build the message history seen by the next participant.
 * Each model receives a system prompt explaining they're in a debate,
 * then the full conversation so far as user/assistant turns.
 */
function buildHistory(
	topic: string,
	currentParticipant: DebateParticipant,
	allMessages: DebateMessage[]
) {
	const system = {
		role: 'system' as const,
		content:
			`Eres ${currentParticipant.name} participando en un debate con otros modelos de IA. ` +
			`El tema del debate es: "${topic}". ` +
			`Responde de forma concisa (máximo 150 palabras). ` +
			`Lee las intervenciones anteriores y responde directamente a los argumentos de los demás. ` +
			`Sé respetuoso pero defiende tu postura con argumentos originales. No repitas lo que ya se ha dicho.`
	};

	const history: { role: 'user' | 'assistant'; content: string }[] = [];

	for (const msg of allMessages) {
		if (msg.participant.modelId === currentParticipant.modelId) {
			// This model's own previous messages appear as "assistant"
			history.push({ role: 'assistant', content: msg.content });
		} else {
			// Other models' messages appear as "user" with attribution
			history.push({
				role: 'user',
				content: `[${msg.participant.name}]: ${msg.content}`
			});
		}
	}

	// If this is the first message, add the topic as a user message
	if (history.length === 0) {
		history.push({ role: 'user', content: `Tema del debate: ${topic}` });
	} else {
		// Add a nudge for the model to continue the debate
		history.push({ role: 'user', content: 'Es tu turno. Responde al debate.' });
	}

	return [system, ...history];
}

/**
 * Run the full debate.
 * Calls each model sequentially, streaming their response,
 * and accumulates the full conversation.
 */
export async function runDebate(
	config: DebateConfig,
	callbacks: {
		onTurnStart: (participant: DebateParticipant, round: number) => void;
		onChunk: (text: string) => void;
		onTurnEnd: (message: DebateMessage) => void;
		onComplete: () => void;
		onError: (participant: DebateParticipant, error: string) => void;
	},
	abortSignal?: AbortSignal
): Promise<DebateMessage[]> {
	const allMessages: DebateMessage[] = [];
	const { participants, rounds, topic } = config;

	for (let round = 1; round <= rounds; round++) {
		for (const participant of participants) {
			if (abortSignal?.aborted) return allMessages;

			callbacks.onTurnStart(participant, round);

			const messages = buildHistory(topic, participant, allMessages);
			let fullContent = '';

			try {
				await routeMessageStream(
					{
						model: participant.modelId,
						provider: participant.provider,
						messages,
						stream: true
					},
					(partial) => {
						fullContent = partial;
						callbacks.onChunk(partial);
					}
				);

				const debateMsg: DebateMessage = {
					participant,
					content: fullContent,
					round
				};
				allMessages.push(debateMsg);
				callbacks.onTurnEnd(debateMsg);
			} catch (err) {
				const errMsg = err instanceof Error ? err.message : String(err);
				callbacks.onError(participant, errMsg);
				// Add error placeholder so debate can continue
				allMessages.push({
					participant,
					content: `[Error: ${errMsg}]`,
					round
				});
			}
		}
	}

	callbacks.onComplete();
	return allMessages;
}
