<script lang="ts">
	import { getAvailableModels } from '$lib/models/registry';
	import type { ModelDef } from '$lib/types';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import ProviderIcon from './ProviderIcon.svelte';

	interface Props {
		onchange?: (model: ModelDef) => void;
	}

	let { onchange }: Props = $props();

	let open = $state(false);
	let search = $state('');
	let highlightedIdx = $state(-1);

	let filtered = $derived(
		search
			? getAvailableModels().filter(
					(m) =>
						m.name.toLowerCase().includes(search.toLowerCase()) ||
						m.alias.toLowerCase().includes(search.toLowerCase())
				)
			: getAvailableModels()
	);

	let current = $derived(getAvailableModels().find((m) => m.id === $selectedModel) ?? getAvailableModels()[0]);

	function select(model: ModelDef) {
		$selectedModel = model.id;
		$selectedProvider = model.provider;
		open = false;
		search = '';
		highlightedIdx = -1;
		onchange?.(model);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) {
			if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				open = true;
				highlightedIdx = 0;
			}
			return;
		}
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIdx = Math.min(highlightedIdx + 1, filtered.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIdx = Math.max(highlightedIdx - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIdx >= 0 && highlightedIdx < filtered.length) {
					select(filtered[highlightedIdx]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				open = false;
				search = '';
				highlightedIdx = -1;
				break;
		}
	}

	const SPEED_LABEL = { fast: '⚡ Rápido', medium: '🔄 Medio', slow: '🐢 Lento' };
	const COST_LABEL: Record<string, string> = {
		free: '🆓 Gratis',
		low: '💲 ~$0.001/msg',
		medium: '💲💲 ~$0.01/msg',
		high: '💲💲💲 ~$0.05/msg'
	};
</script>

<div class="relative">
	<!-- Trigger button -->
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label="Selector de modelo: {current.name}"
		class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors duration-200 text-sm"
		onclick={() => (open = !open)}
		onkeydown={handleKeydown}
	>
		<ProviderIcon provider={current.provider} size={16} />
		<span class="font-medium">{current.name}</span>
		<svg class="w-4 h-4 opacity-50 transition-transform {open ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<!-- Dropdown -->
	{#if open}
		<!-- Backdrop -->
		<button type="button" class="fixed inset-0 z-40" onclick={() => { open = false; search = ''; }} aria-label="Cerrar"></button>

		<div class="absolute top-full left-0 mt-2 w-80 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-scale-in" role="listbox" aria-label="Lista de modelos">
			<!-- Search -->
			<div class="p-2 border-b border-slate-700">
				<input
					type="text"
					placeholder="Buscar modelo..."
					aria-label="Buscar modelo"
					class="w-full px-3 py-2 bg-slate-900 rounded-lg text-sm border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
					bind:value={search}
				/>
			</div>

			<!-- Model list -->
			<div class="max-h-72 overflow-y-auto">
				{#each filtered as model, idx (model.id)}
					<button
						type="button"
						role="option"
						aria-selected={model.id === current.id}
						class="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-slate-700/50 transition-colors text-left"
						class:bg-slate-700={model.id === current.id}
						class:ring-2={idx === highlightedIdx}
						class:ring-blue-500={idx === highlightedIdx}
						onclick={() => select(model)}
					>
						<span class="mt-1 shrink-0"><ProviderIcon provider={model.provider} size={16} /></span>
						<div class="flex-1 min-w-0">
							<div class="font-medium text-sm">{model.name}</div>
							<div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
								<span>{SPEED_LABEL[model.speed]}</span>
								<span>{COST_LABEL[model.costTier]}</span>
								<span class="truncate">{model.capabilities.join(', ')}</span>
							</div>
						</div>
						{#if model.id === current.id}
							<svg class="w-4 h-4 text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
