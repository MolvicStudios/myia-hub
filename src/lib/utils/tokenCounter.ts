/** Rough token estimation and cost lookup for display purposes */

/** Approximate token count — ~1.3 tokens per word for English/Spanish */
export function estimateTokens(text: string): number {
	if (!text) return 0;
	const words = text.trim().split(/\s+/).length;
	return Math.round(words * 1.3);
}

/** Cost per 1M tokens (input, output) in USD — approximate public pricing */
const COST_TABLE: Record<string, [number, number]> = {
	'gpt-4.1':           [2.00, 8.00],
	'gpt-4o':            [2.50, 10.00],
	'claude-sonnet-4-20250514': [3.00, 15.00],
	'claude-3-5-sonnet-20241022': [3.00, 15.00],
	'gemini-2.0-flash':  [0.10, 0.40],
	'mistral-large-latest': [2.00, 6.00],
	'deepseek-chat':     [0.27, 1.10],
	'llama-3.3-70b-versatile': [0, 0], // free on Groq
};

/** Calculate approximate cost in USD */
export function estimateCost(model: string, promptTokens: number, completionTokens: number): number | null {
	const rates = COST_TABLE[model];
	if (!rates) return null;
	const [inputRate, outputRate] = rates;
	return (promptTokens * inputRate + completionTokens * outputRate) / 1_000_000;
}

/** Format cost for display */
export function formatCost(cost: number | null): string {
	if (cost === null) return '';
	if (cost === 0) return 'gratis';
	if (cost < 0.001) return '<$0.001';
	return `~$${cost.toFixed(4)}`;
}
