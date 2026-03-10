<script lang="ts">
	import { settings, updateSetting } from '$lib/stores/settingsStore';

	let testing = $state(false);
	let testResult = $state<{ ok: boolean; message: string; models?: string[] } | null>(null);
	let activeTab = $state<'linux' | 'windows' | 'mac'>('linux');

	async function testConnection() {
		testing = true;
		testResult = null;
		const base = $settings.ollamaEndpoint || 'http://localhost:11434';
		try {
			const res = await fetch(`${base.replace(/\/+$/, '')}/api/tags`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const models = (data.models ?? []).map((m: { name: string }) => m.name);
			testResult = {
				ok: true,
				message: models.length > 0
					? `Conectado — ${models.length} modelo(s) instalado(s)`
					: 'Conectado, pero no hay modelos instalados. Ejecuta: ollama pull llama3.2:3b',
				models
			};
		} catch (e) {
			testResult = {
				ok: false,
				message: 'No se pudo conectar con Ollama. ¿Está ejecutándose?'
			};
		} finally {
			testing = false;
		}
	}
</script>

<div class="space-y-4">
	<h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Ollama (Modelos Locales)</h3>

	<!-- Toggle -->
	<div class="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
		<div>
			<div class="text-sm font-medium">Habilitar Ollama</div>
			<div class="text-xs text-slate-500">Ejecuta modelos de IA en tu máquina sin coste ni API keys</div>
		</div>
		<button
			type="button"
			role="switch"
			aria-checked={$settings.ollamaEnabled}
			aria-label="Activar Ollama"
			class="w-12 h-6 rounded-full transition-colors {$settings.ollamaEnabled ? 'bg-blue-600' : 'bg-slate-600'} relative"
			onclick={() => updateSetting('ollamaEnabled', !$settings.ollamaEnabled)}
		>
			<div class="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all duration-200 {$settings.ollamaEnabled ? 'left-6' : 'left-0.5'}"></div>
		</button>
	</div>

	{#if $settings.ollamaEnabled}
		<!-- Endpoint config -->
		<div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3 animate-fade-in">
			<div class="text-sm font-medium">Endpoint de Ollama</div>
			<div class="flex gap-2">
				<input
					type="url"
					value={$settings.ollamaEndpoint}
					oninput={(e) => updateSetting('ollamaEndpoint', (e.target as HTMLInputElement).value)}
					placeholder="http://localhost:11434"
					class="flex-1 bg-slate-900 rounded-lg px-3 py-2.5 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none font-mono"
				/>
				<button
					type="button"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
					onclick={testConnection}
					disabled={testing}
				>
					{testing ? 'Probando...' : '🔌 Probar'}
				</button>
			</div>

			{#if testResult}
				<div class="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm {testResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">
					<span class="mt-0.5">{testResult.ok ? '✅' : '❌'}</span>
					<div>
						<div>{testResult.message}</div>
						{#if testResult.models?.length}
							<div class="mt-1 text-xs text-slate-400">
								Modelos: {testResult.models.join(', ')}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Tutorial -->
		<div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden animate-fade-in">
			<div class="px-4 pt-4 pb-2">
				<div class="text-sm font-medium mb-1">📖 Guía de instalación</div>
				<div class="text-xs text-slate-500">Instala Ollama en tu sistema para ejecutar modelos locales gratis</div>
			</div>

			<!-- OS Tabs -->
			<div class="flex border-b border-slate-700">
				<button
					type="button"
					class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors {activeTab === 'linux' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30' : 'text-slate-400 hover:text-slate-300'}"
					onclick={() => (activeTab = 'linux')}
				>
					🐧 Linux
				</button>
				<button
					type="button"
					class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors {activeTab === 'windows' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30' : 'text-slate-400 hover:text-slate-300'}"
					onclick={() => (activeTab = 'windows')}
				>
					🪟 Windows
				</button>
				<button
					type="button"
					class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors {activeTab === 'mac' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30' : 'text-slate-400 hover:text-slate-300'}"
					onclick={() => (activeTab = 'mac')}
				>
					🍎 macOS
				</button>
			</div>

			<div class="p-4 space-y-3 text-sm">
				{#if activeTab === 'linux'}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">1. Instalar Ollama:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">curl -fsSL https://ollama.com/install.sh | sh</code>

						<p class="text-slate-300 font-medium mt-3">2. Descargar un modelo:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">3. Verificar que funciona:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">curl http://localhost:11434</code>
						<p class="text-xs text-slate-500">Debe responder: "Ollama is running"</p>
					</div>
				{:else if activeTab === 'windows'}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">1. Descargar el instalador:</p>
						<p class="text-xs text-slate-400">Ve a <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">ollama.com/download</a> y descarga el instalador de Windows.</p>

						<p class="text-slate-300 font-medium mt-3">2. Instalar y ejecutar:</p>
						<p class="text-xs text-slate-400">Ejecuta el instalador. Ollama se inicia automáticamente en la bandeja del sistema.</p>

						<p class="text-slate-300 font-medium mt-3">3. Abrir PowerShell y descargar un modelo:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">4. Verificar:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama list</code>
					</div>
				{:else}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">1. Instalar con Homebrew (o descarga desde ollama.com):</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">brew install ollama</code>

						<p class="text-slate-300 font-medium mt-3">2. Iniciar el servicio:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama serve</code>

						<p class="text-slate-300 font-medium mt-3">3. En otra terminal, descargar un modelo:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">4. Verificar:</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">curl http://localhost:11434</code>
						<p class="text-xs text-slate-500">Debe responder: "Ollama is running"</p>
					</div>
				{/if}

				<div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
					<p class="text-xs text-blue-300">
						<strong>💡 Modelos recomendados:</strong> llama3.2:3b (2GB, rápido), phi4-mini (2.5GB, bueno en código),
						gemma3:4b (3GB, equilibrado), qwen3:4b (2.5GB, multiidioma). Para PC con más RAM: mistral:7b o deepseek-r1:7b.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
