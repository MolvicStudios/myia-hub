<script lang="ts">
	import type { ModelProvider } from '$lib/types';

	interface Props {
		provider: ModelProvider;
		size?: number;
	}

	let { provider, size = 20 }: Props = $props();
</script>

{#if provider === 'openai'}
<!-- OpenAI sparkle/dot -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.98 4.188a5.985 5.985 0 0 0-3.998 2.9 6.045 6.045 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.516 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10a37f"/>
</svg>

{:else if provider === 'anthropic'}
<!-- Anthropic -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0H10.172L16.74 20.48H13.138L11.888 17.2H5.862l-1.25 3.28H1L6.569 3.52zm4.132 10.96L8.886 9.2l-1.815 5.28h3.63z" fill="#d97706"/>
</svg>

{:else if provider === 'gemini'}
<!-- Google Gemini star -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="#4285f4"/>
</svg>

{:else if provider === 'mistral'}
<!-- Mistral horizontal bars -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<rect x="2" y="3" width="20" height="3.5" rx="1" fill="#ff7000"/>
	<rect x="5" y="10.25" width="14" height="3.5" rx="1" fill="#ff7000" opacity="0.7"/>
	<rect x="2" y="17.5" width="20" height="3.5" rx="1" fill="#ff7000"/>
</svg>

{:else if provider === 'deepseek'}
<!-- DeepSeek -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<circle cx="12" cy="12" r="10" stroke="#5b6abf" stroke-width="2.5" fill="none"/>
	<circle cx="12" cy="12" r="4" fill="#5b6abf"/>
	<path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#5b6abf" stroke-width="2" stroke-linecap="round"/>
</svg>

{:else if provider === 'groq'}
<!-- Groq lightning -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#f55036"/>
</svg>

{:else if provider === 'openrouter'}
<!-- OpenRouter diamond/router -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M12 2L22 12 12 22 2 12z" stroke="#8b5cf6" stroke-width="2.2" fill="#8b5cf620"/>
	<circle cx="12" cy="12" r="3" fill="#8b5cf6"/>
	<path d="M12 5v4M12 15v4M5 12h4M15 12h4" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round"/>
</svg>

{:else if provider === 'ollama'}
<!-- Ollama llama -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<path d="M9 3C7.5 3 6 4.5 6 6.5V10c0 1-1 2-2 3v4c0 1 1 2 2 2h1v2h2v-2h6v2h2v-2h1c1 0 2-1 2-2v-4c-1-1-2-2-2-3V6.5C18 4.5 16.5 3 15 3c-1 0-2 .8-3 2-1-1.2-2-2-3-2z" fill="#1e88e5"/>
	<circle cx="9.5" cy="8" r="1.2" fill="white"/>
	<circle cx="14.5" cy="8" r="1.2" fill="white"/>
</svg>

{:else}
<!-- Fallback circle -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<circle cx="12" cy="12" r="10" fill="#64748b"/>
	<text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">?</text>
</svg>
{/if}
