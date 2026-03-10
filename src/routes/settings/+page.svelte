<script lang="ts">
	import ApiKeyManager from '$lib/components/ApiKeyManager.svelte';
	import OllamaSettings from '$lib/components/OllamaSettings.svelte';
	import { settings, updateSetting, toggleTheme } from '$lib/stores/settingsStore';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { clearAllMemory } from '$lib/stores/memoryStore';
	import { getAvailableModels, getModelDef } from '$lib/models/registry';

	function handleClearMemory() {
		if (confirm('¿Eliminar toda la memoria local? Esta acción no se puede deshacer.')) {
			clearAllMemory();
		}
	}

	function handleReset() {
		if (confirm('¿Restaurar toda la configuración a los valores por defecto?')) {
			localStorage.clear();
			window.location.reload();
		}
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-8 space-y-8 overflow-y-auto h-full">
	<div>
		<h1 class="text-2xl font-bold mb-1">Configuración</h1>
		<p class="text-sm text-slate-400">Gestiona tus claves API, preferencias y memoria local.</p>
	</div>

	<!-- API Keys -->
	<section>
		<ApiKeyManager />
	</section>

	<!-- Ollama -->
	<section>
		<OllamaSettings />
	</section>

	<!-- Preferences -->
	<section class="space-y-4">
		<h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Preferencias</h3>

		<!-- Theme -->
		<div class="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
			<div>
				<div class="text-sm font-medium">Tema</div>
				<div class="text-xs text-slate-500">{$settings.theme === 'dark' ? '🌙 Modo oscuro' : '☀️ Modo claro'}</div>
			</div>
			<button
				type="button"
				class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
				onclick={toggleTheme}
			>
				Cambiar
			</button>
		</div>

		<!-- Default model -->
		<div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
			<div class="text-sm font-medium mb-2">Modelo por defecto</div>
			<select
				class="w-full bg-slate-900 rounded-lg px-3 py-2.5 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
				value={$settings.defaultModel}
				onchange={(e) => {
					const id = (e.target as HTMLSelectElement).value;
					updateSetting('defaultModel', id);
					const def = getModelDef(id);
					if (def) { $selectedModel = def.id; $selectedProvider = def.provider; }
				}}
			>
				{#each getAvailableModels() as model (model.id)}
					<option value={model.id}>{model.name} ({model.provider})</option>
				{/each}
			</select>
		</div>
	</section>

	<!-- Memory -->
	<section class="space-y-4">
		<h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Memoria</h3>

		<div class="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
			<div>
				<div class="text-sm font-medium">Memoria local habilitada</div>
				<div class="text-xs text-slate-500">Guardar contexto de conversaciones</div>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={$settings.memoryEnabled}
				aria-label="Activar memoria local"
				class="w-12 h-6 rounded-full transition-colors {$settings.memoryEnabled ? 'bg-blue-600' : 'bg-slate-600'} relative"
				onclick={() => updateSetting('memoryEnabled', !$settings.memoryEnabled)}
			>
				<div class="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all duration-200 {$settings.memoryEnabled ? 'left-6' : 'left-0.5'}"></div>
			</button>
		</div>

		<button
			type="button"
			class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors"
			onclick={handleClearMemory}
		>
			🗑️ Borrar toda la memoria
		</button>
	</section>

	<!-- Danger zone -->
	<section class="space-y-4">
		<h3 class="text-sm font-semibold text-red-400 uppercase tracking-wider">Zona de peligro</h3>
		<button
			type="button"
			class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors border border-red-500/20"
			onclick={handleReset}
		>
			⚠️ Restaurar configuración por defecto
		</button>
	</section>
</div>
