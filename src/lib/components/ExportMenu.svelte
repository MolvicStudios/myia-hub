<script lang="ts">
	import type { Chat } from '$lib/types';
	import { exportAsJson, exportAsMarkdown } from '$lib/utils/exportUtils';
	import { i18n } from '$lib/stores/i18nStore';

	interface Props {
		chat: Chat | null;
		open: boolean;
		onclose?: () => void;
	}

	let { chat, open = $bindable(false), onclose }: Props = $props();

	function exportJson() {
		if (!chat) return;
		exportAsJson(chat);
		close();
	}

	function exportMd() {
		if (!chat) return;
		exportAsMarkdown(chat);
		close();
	}

	function close() {
		open = false;
		onclose?.();
	}

	let modalEl: HTMLDivElement | undefined = $state();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') { close(); return; }
		if (e.key !== 'Tab' || !modalEl) return;
		const focusable = modalEl.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}
</script>

{#if open && chat}
	<!-- Backdrop -->
	<button type="button" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onclick={close} aria-label={$i18n('settings.close')}></button>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div bind:this={modalEl} onkeydown={handleKeydown} tabindex="-1" class="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 w-80 pointer-events-auto animate-scale-in" role="dialog" aria-modal="true" aria-label={$i18n('export.title')}>
			<h3 class="text-lg font-semibold mb-1">{$i18n('export.title')}</h3>
			<p class="text-sm text-slate-400 mb-5">"{chat.title}"</p>

			<div class="space-y-3">
				<button
					type="button"
					class="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left"
					onclick={exportJson}
				>
					<span class="text-2xl">📋</span>
					<div>
						<div class="font-medium text-sm">JSON</div>
						<div class="text-xs text-slate-400">{$i18n('export.json')}</div>
					</div>
				</button>

				<button
					type="button"
					class="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left"
					onclick={exportMd}
				>
					<span class="text-2xl">📝</span>
					<div>
						<div class="font-medium text-sm">Markdown</div>
						<div class="text-xs text-slate-400">{$i18n('export.md')}</div>
					</div>
				</button>
			</div>

			<button
				type="button"
				class="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
				onclick={close}
			>
				{$i18n('export.cancel')}
			</button>
		</div>
	</div>
{/if}
