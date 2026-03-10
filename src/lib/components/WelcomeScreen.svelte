<script lang="ts">
	import { getAvailableModels } from '$lib/models/registry';
	import { createChat } from '$lib/stores/chatStore';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { goto } from '$app/navigation';
	import Avatar from './Avatar.svelte';
	import { i18n } from '$lib/stores/i18nStore';
	import type { ModelProvider } from '$lib/types';

	function startChat(modelId: string, provider: ModelProvider) {
		$selectedModel = modelId;
		$selectedProvider = provider;
		const id = createChat(modelId, provider);
		goto(`/chat/${id}`);
	}
</script>

<div class="flex flex-col items-center justify-center h-full px-4 py-12 animate-fade-in">
	<!-- Logo / Hero avatar -->
	<div class="mb-6">
		<div class="w-20 h-20 rounded-2xl shadow-lg shadow-blue-500/25 animate-bounce-subtle overflow-hidden">
			<img src="/favicon.svg" alt="MyIA Hub" width="80" height="80" class="w-full h-full" />
		</div>
	</div>

	<h1 class="text-2xl font-bold mb-2">MyIA Hub</h1>
	<p class="text-slate-400 text-sm mb-8 text-center max-w-md">
		{$i18n('welcome.subtitle')}
	</p>

	<!-- Quick start models -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mb-8">
		{#each getAvailableModels().slice(0, 8) as model (model.id)}
			<button
				type="button"
				class="flex flex-col items-center gap-2 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 active:scale-95"
				onclick={() => startChat(model.id, model.provider)}
			>
				<Avatar model={model.id} provider={model.provider} state="idle" size="md" />
				<span class="text-xs font-medium text-center">{model.name}</span>
			</button>
		{/each}
	</div>

	<!-- Hint -->
	<p class="text-xs text-slate-500 text-center">
		{$i18n('welcome.hint')}
	</p>
</div>
