<script lang="ts">
	import { settings, updateSetting } from '$lib/stores/settingsStore';
	import { i18n } from '$lib/stores/i18nStore';

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
					? `${$i18n('ollama.connected')} — ${models.length} ${$i18n('ollama.connectedModels')}`
					: $i18n('ollama.noModels'),
				models
			};
		} catch (e) {
			const isCors = e instanceof TypeError && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'));
			testResult = {
				ok: false,
				message: isCors
					? $i18n('ollama.corsError')
					: $i18n('ollama.connectionError')
			};
		} finally {
			testing = false;
		}
	}
</script>

<div class="space-y-4">
	<h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">{$i18n('ollama.title')}</h3>

	<!-- Toggle -->
	<div class="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
		<div>
			<div class="text-sm font-medium">{$i18n('ollama.enable')}</div>
			<div class="text-xs text-slate-500">{$i18n('ollama.enableDesc')}</div>
		</div>
		<button
			type="button"
			role="switch"
			aria-checked={$settings.ollamaEnabled}
			aria-label={$i18n('ollama.enableAria')}
			class="w-12 h-6 rounded-full transition-colors {$settings.ollamaEnabled ? 'bg-blue-600' : 'bg-slate-600'} relative"
			onclick={() => updateSetting('ollamaEnabled', !$settings.ollamaEnabled)}
		>
			<div class="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all duration-200 {$settings.ollamaEnabled ? 'left-6' : 'left-0.5'}"></div>
		</button>
	</div>

	{#if $settings.ollamaEnabled}
		<!-- Endpoint config -->
		<div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3 animate-fade-in">
			<div class="text-sm font-medium">{$i18n('ollama.endpoint')}</div>
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
					{testing ? $i18n('ollama.testing') : $i18n('ollama.test')}
				</button>
			</div>

			{#if testResult}
				<div class="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm {testResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">
					<span class="mt-0.5">{testResult.ok ? '✅' : '❌'}</span>
					<div>
						<div>{testResult.message}</div>
						{#if testResult.models?.length}
							<div class="mt-1 text-xs text-slate-400">
								{$i18n('ollama.models')}: {testResult.models.join(', ')}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Tutorial -->
		<div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden animate-fade-in">
			<!-- Quick fix CORS - prominent -->
			<div class="p-4 bg-amber-500/10 border-b border-amber-500/20">
				<div class="text-sm font-semibold text-amber-300 mb-2">{$i18n('ollama.quickFix')}</div>
				<p class="text-xs text-slate-400 mb-2">{$i18n('ollama.quickFixDesc')}</p>

				<!-- OS Tabs for quick fix -->
				<div class="flex gap-1 mb-2">
					<button type="button" class="px-2 py-1 text-xs rounded {activeTab === 'linux' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-500 hover:text-slate-300'}" onclick={() => (activeTab = 'linux')}>Linux</button>
					<button type="button" class="px-2 py-1 text-xs rounded {activeTab === 'windows' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-500 hover:text-slate-300'}" onclick={() => (activeTab = 'windows')}>Windows</button>
					<button type="button" class="px-2 py-1 text-xs rounded {activeTab === 'mac' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-500 hover:text-slate-300'}" onclick={() => (activeTab = 'mac')}>macOS</button>
				</div>

				{#if activeTab === 'linux'}
					<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">sudo systemctl stop ollama; OLLAMA_ORIGINS="*" ollama serve</code>
					<p class="text-xs text-slate-500 mt-1">{$i18n('ollama.quickFixLinux')}</p>
				{:else if activeTab === 'windows'}
					<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">$env:OLLAMA_ORIGINS="*"; ollama serve</code>
					<p class="text-xs text-slate-500 mt-1">{$i18n('ollama.quickFixWindows')}</p>
				{:else}
					<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">pkill ollama; OLLAMA_ORIGINS="*" ollama serve</code>
					<p class="text-xs text-slate-500 mt-1">{$i18n('ollama.quickFixMac')}</p>
				{/if}
			</div>

			<div class="px-4 pt-4 pb-2">
				<div class="text-sm font-medium mb-1">{$i18n('ollama.fullInstall')}</div>
				<div class="text-xs text-slate-500">{$i18n('ollama.fullInstallDesc')}</div>
			</div>

			<div class="p-4 space-y-3 text-sm">
				{#if activeTab === 'linux'}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">{$i18n('ollama.step1Install')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">curl -fsSL https://ollama.com/install.sh | sh</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step2')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step3Linux')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">sudo systemctl stop ollama; OLLAMA_ORIGINS="*" ollama serve</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.makePermanent')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">sudo systemctl edit ollama</code>
						<p class="text-xs text-slate-500">{$i18n('ollama.addLinesAndSave')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-yellow-300 select-all">[Service]
Environment="OLLAMA_ORIGINS=*"</code>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all mt-1">sudo systemctl daemon-reload && sudo systemctl restart ollama</code>
					</div>
				{:else if activeTab === 'windows'}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">{$i18n('ollama.step1Windows')}</p>
						<p class="text-xs text-slate-400">{$i18n('ollama.step1WindowsDesc')} <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">ollama.com/download</a>{$i18n('ollama.step1WindowsDesc2')}</p>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step2Windows')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step3Windows')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">$env:OLLAMA_ORIGINS="*"; ollama serve</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.makePermanent')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')</code>
						<p class="text-xs text-slate-500">{$i18n('ollama.restartAfter')}</p>
					</div>
				{:else}
					<div class="space-y-2">
						<p class="text-slate-300 font-medium">{$i18n('ollama.step1Install')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">brew install ollama</code>
						<p class="text-xs text-slate-500">{$i18n('ollama.step1MacAlt')} <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">ollama.com/download</a></p>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step2')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all">ollama pull llama3.2:3b</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.step3Mac')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-green-400 select-all whitespace-pre-wrap">pkill ollama; OLLAMA_ORIGINS="*" ollama serve</code>

						<p class="text-slate-300 font-medium mt-3">{$i18n('ollama.makePermanentMac')}</p>
						<code class="block bg-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-yellow-300 select-all">export OLLAMA_ORIGINS="*"</code>
					</div>
				{/if}

				<div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
					<p class="text-xs text-blue-300">
						<strong>💡 {$i18n('ollama.recommendedModels')}</strong> {$i18n('ollama.recommendedDesc')}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
