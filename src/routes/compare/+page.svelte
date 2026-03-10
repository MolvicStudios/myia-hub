<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { MODEL_REGISTRY } from '$lib/models/registry';
	import { getApiKey } from '$lib/stores/apiKeyStore';
	import { routeMessageStreamIndependent } from '$lib/models/router';
	import type { ModelDef, ModelProvider } from '$lib/types';

	let selected: ModelDef[] = $state([]);
	let prompt = $state('');
	let results = $state<Record<string, { content: string; loading: boolean; error: string | null; time: number }>>({});

	const cloudModels = MODEL_REGISTRY.filter((m) => m.provider !== 'ollama');
	const localModels = MODEL_REGISTRY.filter((m) => m.provider === 'ollama');

	function toggleModel(model: ModelDef) {
		const idx = selected.findIndex((m) => m.id === model.id);
		if (idx >= 0) {
			selected = selected.filter((_, i) => i !== idx);
		} else if (selected.length < 4) {
			selected = [...selected, model];
		}
	}

	async function compare() {
		if (!prompt.trim() || selected.length < 2) return;

		const newResults: typeof results = {};
		for (const model of selected) {
			newResults[model.id] = { content: '', loading: true, error: null, time: 0 };
		}
		results = newResults;

		await Promise.allSettled(
			selected.map(async (model) => {
				const start = performance.now();
				try {
					await routeMessageStreamIndependent(
						{
							model: model.id,
							provider: model.provider,
							messages: [{ role: 'user', content: prompt }],
							stream: true
						},
						(partial) => {
							results = {
								...results,
								[model.id]: { ...results[model.id], content: partial, loading: true, error: null, time: performance.now() - start }
							};
						}
					);
					results = {
						...results,
						[model.id]: { ...results[model.id], loading: false, time: performance.now() - start }
					};
				} catch (err) {
					results = {
						...results,
						[model.id]: {
							...results[model.id],
							loading: false,
							error: err instanceof Error ? err.message : 'Error desconocido',
							time: performance.now() - start
						}
					};
				}
			})
		);
	}
</script>

<svelte:head>
	<title>Comparador — MyIA Hub</title>
	<meta name="description" content="Compara respuestas de diferentes modelos de IA lado a lado." />
</svelte:head>

<main id="main-content" class="flex flex-col h-full overflow-hidden">
	<div class="p-4 border-b border-slate-800 shrink-0">
		<div class="flex items-center gap-3 mb-3">
			<a href="/" class="text-blue-400 hover:underline text-sm">← Volver</a>
			<h1 class="text-lg font-bold text-white">⚡ Comparador de modelos</h1>
		</div>

		<!-- Model selection -->
		<div class="flex flex-wrap gap-2 mb-3">
			{#each [...cloudModels, ...localModels] as model (model.id)}
				{@const isSelected = selected.some((s) => s.id === model.id)}
				<button
					type="button"
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
						{isSelected ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'}"
					onclick={() => toggleModel(model)}
					disabled={!isSelected && selected.length >= 4}
				>
					<span>{model.icon}</span>
					{model.name}
				</button>
			{/each}
		</div>
		<p class="text-xs text-slate-500 mb-3">Selecciona 2-4 modelos ({selected.length}/4)</p>

		<!-- Prompt input -->
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={prompt}
				placeholder="Escribe tu prompt para comparar..."
				class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
				onkeydown={(e) => { if (e.key === 'Enter') compare(); }}
			/>
			<button
				type="button"
				class="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
				onclick={compare}
				disabled={selected.length < 2 || !prompt.trim()}
			>
				Comparar
			</button>
		</div>
	</div>

	<!-- Results grid -->
	<div class="flex-1 overflow-auto p-4">
		{#if Object.keys(results).length > 0}
			<div class="grid gap-4" style="grid-template-columns: repeat({Math.min(selected.length, 4)}, 1fr);">
				{#each selected as model (model.id)}
					{@const r = results[model.id]}
					{#if r}
						<div class="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
							<!-- Header -->
							<div class="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50 bg-slate-800/80">
								<Avatar model={model.id} provider={model.provider} state={r.loading ? 'typing' : 'idle'} size="sm" />
								<span class="text-sm font-medium">{model.name}</span>
								{#if !r.loading}
									<span class="ml-auto text-[10px] text-slate-500">{(r.time / 1000).toFixed(1)}s</span>
								{/if}
							</div>
							<!-- Content -->
							<div class="flex-1 p-3 text-sm leading-relaxed overflow-y-auto max-h-96">
								{#if r.error}
									<p class="text-red-400 text-xs">{r.error}</p>
								{:else if r.content}
									<p class="whitespace-pre-wrap text-slate-300">{r.content}</p>
								{:else if r.loading}
									<div class="flex gap-1 text-slate-500">
										<span class="typing-dot w-2 h-2 bg-slate-500 rounded-full"></span>
										<span class="typing-dot w-2 h-2 bg-slate-500 rounded-full"></span>
										<span class="typing-dot w-2 h-2 bg-slate-500 rounded-full"></span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
				<span class="text-4xl mb-4">⚡</span>
				<p>Selecciona modelos y escribe un prompt para compararlos</p>
			</div>
		{/if}
	</div>
</main>
