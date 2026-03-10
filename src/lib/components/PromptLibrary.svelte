<script lang="ts">
	import { savedPrompts, addPrompt, removePrompt } from '$lib/stores/promptStore';
	import { i18n } from '$lib/stores/i18nStore';

	interface Props {
		onSelect: (text: string) => void;
	}

	let { onSelect }: Props = $props();
	let open = $state(false);
	let newText = $state('');
	let newLabel = $state('');

	function handleAdd() {
		const text = newText.trim();
		if (!text) return;
		addPrompt(text, newLabel.trim() || undefined);
		newText = '';
		newLabel = '';
	}
</script>

<div class="relative">
	<button
		onclick={() => (open = !open)}
		class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
		title={$i18n('prompts.saved')}
		aria-label={$i18n('prompts.saved')}
	>
		⭐
	</button>

	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute bottom-12 left-0 w-80 max-h-96 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in"
			onkeydown={(e) => e.key === 'Escape' && (open = false)}
		>
			<div class="p-3 border-b border-slate-700 flex items-center justify-between">
				<h3 class="text-sm font-semibold text-slate-200">{$i18n('prompts.saved')}</h3>
				<button onclick={() => (open = false)} class="text-slate-400 hover:text-white text-lg">&times;</button>
			</div>

			<!-- Add new -->
			<div class="p-3 border-b border-slate-700 space-y-2">
				<input
					bind:value={newLabel}
					placeholder={$i18n('prompts.labelPlaceholder')}
					class="w-full bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 focus:border-blue-500 outline-none"
				/>
				<textarea
					bind:value={newText}
					placeholder={$i18n('prompts.textPlaceholder')}
					rows="2"
					class="w-full bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 focus:border-blue-500 outline-none resize-none"
				></textarea>
				<button
					onclick={handleAdd}
					disabled={!newText.trim()}
					class="w-full text-sm py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
				>
					{$i18n('prompts.save')}
				</button>
			</div>

			<!-- List -->
			<div class="overflow-y-auto max-h-52">
				{#each $savedPrompts as prompt (prompt.id)}
					<div class="flex items-start gap-2 p-3 hover:bg-slate-800/50 border-b border-slate-800 group">
						<button
							onclick={() => { onSelect(prompt.text); open = false; }}
							class="flex-1 text-left"
						>
							<div class="text-sm text-slate-200 font-medium truncate">{prompt.label}</div>
							<div class="text-xs text-slate-400 line-clamp-2">{prompt.text}</div>
						</button>
						<button
							onclick={() => removePrompt(prompt.id)}
							class="text-slate-500 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
							title={$i18n('prompts.delete')}
						>
							🗑️
						</button>
					</div>
				{:else}
					<p class="p-4 text-sm text-slate-500 text-center">{$i18n('prompts.empty')}</p>
				{/each}
			</div>
		</div>
	{/if}
</div>
