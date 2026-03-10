<script lang="ts">
	import type { ModelProvider, AvatarState } from '$lib/types';

	interface Props {
		model: string;
		provider: ModelProvider;
		state: AvatarState;
		size?: 'sm' | 'md' | 'lg';
	}

	let { model, provider, state = 'idle', size = 'md' }: Props = $props();

	const MODEL_COLORS: Record<string, string> = {
		openai: '#10a37f',
		anthropic: '#d97706',
		gemini: '#4285f4',
		mistral: '#ff7000',
		deepseek: '#5b6abf',
		groq: '#f55036',
		openrouter: '#8b5cf6',
		ollama: '#1e88e5'
	};

	const MODEL_ICONS: Record<string, string> = {
		openai: '✦',
		anthropic: '◈',
		gemini: '◆',
		mistral: '▲',
		deepseek: '◉',
		groq: '⚡',
		openrouter: '◇',
		ollama: '🦙'
	};

	const SIZES = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-lg', lg: 'w-16 h-16 text-2xl' };

	let color = $derived(MODEL_COLORS[provider] ?? '#64748b');
	let icon = $derived(MODEL_ICONS[provider] ?? '●');
	let sizeClass = $derived(SIZES[size]);

	let stateClass = $derived(
		state === 'loading'
			? 'animate-pulse'
			: state === 'typing'
				? 'animate-bounce-subtle'
				: state === 'error'
					? 'ring-2 ring-red-500'
					: ''
	);
</script>

<div
	class="relative inline-flex items-center justify-center rounded-full transition-all duration-300 {sizeClass} {stateClass}"
	style="background: {color}20; color: {color}; border: 2px solid {color}40;"
	role="img"
	aria-label="{provider} avatar, estado: {state === 'idle' ? 'listo' : state === 'loading' ? 'cargando' : state === 'typing' ? 'escribiendo' : 'error'}"
>
	<!-- Glow ring for loading state -->
	{#if state === 'loading'}
		<div
			class="absolute inset-0 rounded-full animate-pulse-glow"
			style="color: {color}"
		></div>
	{/if}

	<!-- Icon -->
	<span class="relative z-10 select-none">{icon}</span>

	<!-- Typing indicator dots -->
	{#if state === 'typing'}
		<div class="absolute -bottom-1 flex gap-0.5">
			<span class="typing-dot w-1 h-1 rounded-full" style="background: {color}"></span>
			<span class="typing-dot w-1 h-1 rounded-full" style="background: {color}"></span>
			<span class="typing-dot w-1 h-1 rounded-full" style="background: {color}"></span>
		</div>
	{/if}

	<!-- Error indicator -->
	{#if state === 'error'}
		<div class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-slate-900 flex items-center justify-center" aria-hidden="true">
			<span class="text-[8px] text-white font-bold">!</span>
		</div>
	{/if}
</div>
