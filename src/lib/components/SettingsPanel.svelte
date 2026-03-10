<script lang="ts">
	import ApiKeyManager from './ApiKeyManager.svelte';
	import OllamaSettings from './OllamaSettings.svelte';
	import { settings, updateSetting, setTheme } from '$lib/stores/settingsStore';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { clearAllMemory } from '$lib/stores/memoryStore';
	import { getAvailableModels, getModelDef, isLocalEnvironment } from '$lib/models/registry';
	import { locale, setLocale, i18n } from '$lib/stores/i18nStore';
	import { onMount } from 'svelte';

	const showOllama = isLocalEnvironment();

	interface Props {
		open: boolean;
		onclose?: () => void;
	}

	let { open = $bindable(false), onclose }: Props = $props();

	let activeTab = $state<'api' | 'ollama' | 'prefs' | 'memory'>('api');

	function close() {
		open = false;
		onclose?.();
	}

	function handleClearMemory() {
		if (confirm('¿Borrar toda la memoria local?')) {
			clearAllMemory();
		}
	}

	let panelEl: HTMLDivElement | undefined = $state();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') { close(); return; }
		if (e.key !== 'Tab' || !panelEl) return;
		const focusable = panelEl.querySelectorAll<HTMLElement>(
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

{#if open}
	<!-- Backdrop -->
	<button type="button" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onclick={close} aria-label="Cerrar"></button>

	<!-- Panel -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={panelEl} onkeydown={handleKeydown} tabindex="-1" class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl animate-slide-right overflow-y-auto" role="dialog" aria-modal="true" aria-label="Panel de configuración">
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
			<h2 class="text-lg font-semibold">Configuración</h2>
			<button type="button" class="p-2 rounded-lg hover:bg-slate-800 transition-colors" onclick={close} aria-label="Cerrar configuración">
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-slate-800" role="tablist" aria-label="Secciones de configuración">
			{#each [
				{ id: 'api', label: '🔑 APIs' },
				...(showOllama ? [{ id: 'ollama', label: '🦙 Ollama' }] : []),
				{ id: 'prefs', label: '⚙️ Prefs' },
				{ id: 'memory', label: '🧠 Memoria' }
			] as tab (tab.id)}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === tab.id}
					aria-controls="settings-panel-{tab.id}"
					class="flex-1 py-3 text-sm font-medium transition-colors
					{activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}"
					onclick={() => (activeTab = tab.id as typeof activeTab)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Content -->
		<div class="p-4" role="tabpanel" id="settings-panel-{activeTab}">
			{#if activeTab === 'api'}
				<ApiKeyManager />
			{:else if activeTab === 'ollama'}
				<OllamaSettings />
			{:else if activeTab === 'prefs'}
				<div class="space-y-4">
					<!-- Theme -->
					<div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
						<div class="text-sm font-medium mb-2">Tema</div>
						<div class="grid grid-cols-2 gap-2">
							{#each [
								{ id: 'dark', label: '🌙 Oscuro', bg: '#0f172a', fg: '#e2e8f0' },
								{ id: 'light', label: '☀️ Claro', bg: '#f8fafc', fg: '#1e293b' },
								{ id: 'solarized', label: '🌊 Solarized', bg: '#002b36', fg: '#93a1a1' },
								{ id: 'nord', label: '❄️ Nord', bg: '#2e3440', fg: '#d8dee9' }
							] as theme (theme.id)}
								<button
									type="button"
									class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all {$settings.theme === theme.id
										? 'border-blue-500 ring-1 ring-blue-500/50'
										: 'border-slate-700 hover:border-slate-600'}"
									onclick={() => setTheme(theme.id as import('$lib/types').UserSettings['theme'])}
								>
									<span class="w-4 h-4 rounded-full border border-slate-600 shrink-0" style="background:{theme.bg}"></span>
									{theme.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Default model -->
					<div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
						<div class="text-sm font-medium mb-2">Modelo por defecto</div>
						<select
							class="w-full bg-slate-900 rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
							value={$settings.defaultModel}
							onchange={(e) => {
								const id = (e.target as HTMLSelectElement).value;
								updateSetting('defaultModel', id);
								const def = getModelDef(id);
								if (def) { $selectedModel = def.id; $selectedProvider = def.provider; }
							}}
						>
							{#each getAvailableModels() as model (model.id)}
								<option value={model.id}>{model.name}</option>
							{/each}
						</select>
					</div>

					<!-- Language -->
					<div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
						<div class="text-sm font-medium mb-2">{$i18n('settings.language')}</div>
						<div class="flex gap-2">
							<button
								type="button"
								class="flex-1 py-2 rounded-lg text-sm transition-all {$locale === 'es' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
								onclick={() => setLocale('es')}
							>
								🇪🇸 Español
							</button>
							<button
								type="button"
								class="flex-1 py-2 rounded-lg text-sm transition-all {$locale === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
								onclick={() => setLocale('en')}
							>
								🇬🇧 English
							</button>
						</div>
					</div>
				</div>
			{:else if activeTab === 'memory'}
				<div class="space-y-4">
					<!-- Memory toggle -->
					<div class="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
						<div>
							<div class="text-sm font-medium">Memoria local</div>
							<div class="text-xs text-slate-500">Recordar contexto entre sesiones</div>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked={$settings.memoryEnabled}
							aria-label="Activar memoria local"
							class="w-12 h-6 rounded-full transition-colors {$settings.memoryEnabled ? 'bg-blue-600' : 'bg-slate-600'}"
							onclick={() => updateSetting('memoryEnabled', !$settings.memoryEnabled)}
						>
							<div class="w-5 h-5 rounded-full bg-white shadow transition-transform {$settings.memoryEnabled ? 'translate-x-6' : 'translate-x-0.5'}"></div>
						</button>
					</div>

					<!-- Clear memory -->
					<button
						type="button"
						class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors"
						onclick={handleClearMemory}
					>
						🗑️ Borrar toda la memoria
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
