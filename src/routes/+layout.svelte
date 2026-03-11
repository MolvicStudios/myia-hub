<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ModelSelector from '$lib/components/ModelSelector.svelte';
	import StatusIndicator from '$lib/components/StatusIndicator.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
	import { settings, toggleSidebar, applyTheme } from '$lib/stores/settingsStore';
	import { avatarState, selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { loadChats } from '$lib/stores/chatStore';
	import { onMount } from 'svelte';
	import { getModelDef } from '$lib/models/registry';
	import { i18n } from '$lib/stores/i18nStore';
	import { locale } from '$lib/stores/i18nStore';

	let { children } = $props();
	let settingsOpen = $state(false);

	onMount(() => {
		loadChats();
		// Apply saved theme
		applyTheme($settings.theme);
		// Sync default model from settings
		const defaultDef = getModelDef($settings.defaultModel);
		if (defaultDef) {
			$selectedModel = defaultDef.id;
			$selectedProvider = defaultDef.provider;
		}
		// Update html lang attribute when locale changes
		const unsubLang = locale.subscribe((l) => {
			document.documentElement.lang = l;
		});
		// Listen for open-settings event from keyboard shortcuts
		function openSettings() { settingsOpen = true; }
		window.addEventListener('myia:open-settings', openSettings);
		return () => {
			window.removeEventListener('myia:open-settings', openSettings);
			unsubLang();
		};
	});
</script>

<div class="flex h-dvh overflow-hidden bg-slate-950 text-slate-100">
	<!-- Skip to content -->
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
	>
		{$i18n('layout.skipToContent')}
	</a>

	<!-- Sidebar -->
	<Sidebar />

	<!-- Main area -->
	<div class="flex-1 flex flex-col min-w-0">
		<!-- Top bar -->
		<header class="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm shrink-0">
			<div class="flex items-center gap-3">
				<!-- Sidebar toggle (mobile) -->
				<button
					type="button"
					aria-label={$i18n('layout.openMenu')}
					class="p-2 rounded-lg hover:bg-slate-800 transition-colors md:hidden"
					onclick={toggleSidebar}
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>

				<!-- Sidebar toggle (desktop) -->
				<button
					type="button"
					aria-label={$i18n('layout.toggleSidebar')}
					class="p-2 rounded-lg hover:bg-slate-800 transition-colors hidden md:block"
					onclick={toggleSidebar}
					title="Toggle sidebar"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
					</svg>
				</button>

				<ModelSelector />
			</div>

			<div class="flex items-center gap-3">
				<StatusIndicator
					state={$avatarState}
					model={$selectedModel}
					provider={$selectedProvider}
				/>

				<!-- Settings button -->
				<button
					type="button"
					aria-label={$i18n('layout.openSettings')}
					class="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
					onclick={() => (settingsOpen = true)}
					title={$i18n('settings.title')}
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</button>
			</div>
		</header>

		<!-- Page content -->
		<main class="flex-1 overflow-hidden" id="main-content">
			{@render children()}
		</main>

		<!-- Footer legal links -->
		<footer class="shrink-0 flex items-center justify-center gap-4 px-4 py-1.5 text-xs text-slate-500 border-t border-slate-800/50">
			<a href="/tutorial" class="hover:text-slate-300 transition-colors">{$i18n('footer.tutorial')}</a>
			<span>·</span>
			<a href="/compare" class="hover:text-slate-300 transition-colors">{$i18n('footer.compare')}</a>
			<span>·</span>
			<a href="/debate" class="hover:text-slate-300 transition-colors">{$i18n('footer.debate')}</a>
			<span>·</span>
			<a href="mailto:molvicstudios@outlook.com?subject=Feedback%20MyIA%20Hub" class="hover:text-slate-300 transition-colors">Feedback</a>
			<span>·</span>
			<a href="/privacy" class="hover:text-slate-300 transition-colors">{$i18n('footer.privacy')}</a>
			<span>·</span>
			<a href="/cookies" class="hover:text-slate-300 transition-colors">{$i18n('footer.cookies')}</a>
		</footer>
	</div>

	<!-- Settings panel -->
	<SettingsPanel bind:open={settingsOpen} />
</div>

<!-- Global overlays -->
<CookieBanner />
<InstallPrompt />
<KeyboardShortcuts />
