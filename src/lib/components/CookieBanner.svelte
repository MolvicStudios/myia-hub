<script lang="ts">
	import { settings, updateSetting } from '$lib/stores/settingsStore';

	let visible = $state(false);
	let showConfig = $state(false);
	let analyticsConsent = $state(false);
	let adConsent = $state(false);

	function checkConsent() {
		try {
			const consent = localStorage.getItem('myia_cookie_consent');
			if (!consent) { visible = true; return; }
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

	function saveConfig() {
		const value = adConsent ? 'accepted' : 'rejected';
		try { localStorage.setItem('myia_cookie_consent', value); } catch {}
		visible = false;
	}

	import { onMount } from 'svelte';
	onMount(checkConsent);

	import { i18n } from '$lib/stores/i18nStore';
</script>

{#if visible}
	<div class="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-fade-in" role="dialog" aria-label={$i18n('cookies.consent')}>
		<div class="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl">
			{#if !showConfig}
				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<div class="flex-1 text-sm text-slate-300">
						<p>{$i18n('cookies.banner')}
							<a href="/cookies" class="text-blue-400 hover:underline">{$i18n('cookies.moreInfo')}</a>
						</p>
					</div>
					<div class="flex gap-2 shrink-0">
						<button
							type="button"
							class="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
							onclick={reject}
						>
							{$i18n('cookies.reject')}
						</button>
						<button
							type="button"
							class="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
							onclick={() => showConfig = true}
						>
							{$i18n('cookies.configure')}
						</button>
						<button
							type="button"
							class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
							onclick={accept}
						>
							{$i18n('cookies.accept')}
						</button>
					</div>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					<h3 class="text-white font-semibold text-sm">{$i18n('cookies.configTitle')}</h3>

					<label class="flex items-center gap-3 text-sm text-slate-300">
						<input type="checkbox" checked disabled class="accent-blue-500" />
						<span><strong>{$i18n('cookies.necessary')}</strong> — {$i18n('cookies.necessaryDesc')}</span>
					</label>

					<label class="flex items-center gap-3 text-sm text-slate-300">
						<input type="checkbox" bind:checked={adConsent} class="accent-blue-500" />
						<span><strong>{$i18n('cookies.advertising')}</strong> — {$i18n('cookies.advertisingDesc')}</span>
					</label>

					<div class="flex gap-2 justify-end">
						<button
							type="button"
							class="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
							onclick={() => showConfig = false}
						>
							{$i18n('cookies.back')}
						</button>
						<button
							type="button"
							class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
							onclick={saveConfig}
						>
							{$i18n('cookies.saveConfig')}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
