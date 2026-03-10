<script lang="ts">
	import { settings, updateSetting } from '$lib/stores/settingsStore';

	let visible = $state(false);

	function checkConsent() {
		try {
			const consent = localStorage.getItem('myia_cookie_consent');
			if (!consent) visible = true;
		} catch {
			visible = true;
		}
	}

	function accept() {
		try { localStorage.setItem('myia_cookie_consent', 'accepted'); } catch {}
		visible = false;
	}

	function reject() {
		try { localStorage.setItem('myia_cookie_consent', 'rejected'); } catch {}
		visible = false;
	}

	import { onMount } from 'svelte';
	onMount(checkConsent);
</script>

{#if visible}
	<div class="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-fade-in" role="dialog" aria-label="Consentimiento de cookies">
		<div class="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl">
			<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div class="flex-1 text-sm text-slate-300">
					<p>Usamos cookies propias y de terceros (Google AdSense) para mejorar tu experiencia y mostrar publicidad.
						<a href="/cookies" class="text-blue-400 hover:underline">Más información</a>
					</p>
				</div>
				<div class="flex gap-2 shrink-0">
					<button
						type="button"
						class="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
						onclick={reject}
					>
						Rechazar
					</button>
					<button
						type="button"
						class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
						onclick={accept}
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
