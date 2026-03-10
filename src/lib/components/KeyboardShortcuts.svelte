<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toggleSidebar } from '$lib/stores/settingsStore';

	let showHelp = $state(false);

	const SHORTCUTS = [
		{ keys: 'Ctrl+N', desc: 'Nuevo chat' },
		{ keys: 'Ctrl+B', desc: 'Toggle sidebar' },
		{ keys: 'Ctrl+,', desc: 'Configuración' },
		{ keys: 'Ctrl+/', desc: 'Atajos de teclado' },
		{ keys: 'Escape', desc: 'Cerrar panel' }
	];

	onMount(() => {
		function handler(e: KeyboardEvent) {
			const ctrl = e.ctrlKey || e.metaKey;

			// Ctrl+N — new chat
			if (ctrl && e.key === 'n') {
				e.preventDefault();
				goto('/');
				return;
			}

			// Ctrl+B — toggle sidebar
			if (ctrl && e.key === 'b') {
				e.preventDefault();
				toggleSidebar();
				return;
			}

			// Ctrl+, — settings (dispatch custom event)
			if (ctrl && e.key === ',') {
				e.preventDefault();
				window.dispatchEvent(new CustomEvent('myia:open-settings'));
				return;
			}

			// Ctrl+/ — show shortcuts help
			if (ctrl && e.key === '/') {
				e.preventDefault();
				showHelp = !showHelp;
				return;
			}

			// Escape — close help or dispatch close
			if (e.key === 'Escape' && showHelp) {
				showHelp = false;
				return;
			}
		}

		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

{#if showHelp}
	<button type="button" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onclick={() => (showHelp = false)} aria-label="Cerrar"></button>
	<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-80 animate-scale-in">
		<h3 class="text-lg font-semibold text-slate-200 mb-4">Atajos de teclado</h3>
		<div class="space-y-2">
			{#each SHORTCUTS as shortcut}
				<div class="flex items-center justify-between text-sm">
					<span class="text-slate-400">{shortcut.desc}</span>
					<kbd class="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300">{shortcut.keys}</kbd>
				</div>
			{/each}
		</div>
		<button
			onclick={() => (showHelp = false)}
			class="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
		>
			Cerrar
		</button>
	</div>
{/if}
