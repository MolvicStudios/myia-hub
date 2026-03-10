<script lang="ts">
	import { onMount } from 'svelte';

	let deferredPrompt: BeforeInstallPromptEvent | null = $state(null);
	let dismissed = $state(false);

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	onMount(() => {
		if (localStorage.getItem('myia_pwa_dismissed')) {
			dismissed = true;
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
		};

		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	async function install() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const choice = await deferredPrompt.userChoice;
		if (choice.outcome === 'accepted') {
			deferredPrompt = null;
		}
	}

	function dismiss() {
		deferredPrompt = null;
		dismissed = true;
		localStorage.setItem('myia_pwa_dismissed', '1');
	}
</script>

{#if deferredPrompt && !dismissed}
	<div class="fixed bottom-20 right-4 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 max-w-xs animate-scale-in">
		<div class="flex items-start gap-3">
			<span class="text-2xl">📱</span>
			<div class="flex-1">
				<p class="text-sm font-medium text-slate-200">Instalar MyIA Hub</p>
				<p class="text-xs text-slate-400 mt-0.5">Accede más rápido desde tu escritorio o móvil</p>
				<div class="flex gap-2 mt-3">
					<button
						onclick={install}
						class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors"
					>
						Instalar
					</button>
					<button
						onclick={dismiss}
						class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
					>
						Ahora no
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
