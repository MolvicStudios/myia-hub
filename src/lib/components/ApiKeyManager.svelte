<script lang="ts">
	import { apiKeys, saveApiKey, removeApiKey, validateKeyFormat, getApiKey } from '$lib/stores/apiKeyStore';
	import { WORKER_PROXY } from '$lib/config';
	import { i18n } from '$lib/stores/i18nStore';
	import type { ModelProvider } from '$lib/types';

	const ALL_PROVIDERS: { id: ModelProvider; name: string; color: string; placeholder: string }[] = [
		{ id: 'openai', name: 'OpenAI', color: '#10a37f', placeholder: 'sk-...' },
		{ id: 'anthropic', name: 'Anthropic', color: '#d97706', placeholder: 'sk-ant-...' },
		{ id: 'gemini', name: 'Google Gemini', color: '#4285f4', placeholder: 'API key...' },
		{ id: 'mistral', name: 'Mistral', color: '#ff7000', placeholder: 'API key...' },
		{ id: 'deepseek', name: 'DeepSeek', color: '#5b6abf', placeholder: 'sk-...' },
		{ id: 'groq', name: 'Groq', color: '#f55036', placeholder: 'gsk_...' },
		{ id: 'openrouter', name: 'OpenRouter', color: '#8b5cf6', placeholder: 'sk-or-...' }
	];

	// Ollama is managed separately in OllamaSettings
	const PROVIDERS = ALL_PROVIDERS;

	let editingProvider = $state<ModelProvider | null>(null);
	let keyInput = $state('');
	let keyError = $state('');
	let showKey = $state<Record<string, boolean>>({});

	function startEdit(provider: ModelProvider) {
		editingProvider = provider;
		keyInput = getApiKey(provider) ?? '';
	}

	function save() {
		if (!editingProvider) return;
		const trimmed = keyInput.trim();
		if (!trimmed) return;
		if (!validateKeyFormat(editingProvider, trimmed)) {
			keyError = $i18n('apikeys.invalidFormat');
			return;
		}
		saveApiKey(editingProvider, trimmed);
		editingProvider = null;
		keyInput = '';
		keyError = '';
	}

	function cancel() {
		editingProvider = null;
		keyInput = '';
		keyError = '';
	}

	function remove(provider: ModelProvider) {
		removeApiKey(provider);
	}

	function toggleShow(provider: string) {
		showKey[provider] = !showKey[provider];
	}

	function hasKey(provider: ModelProvider): boolean {
		return $apiKeys.some((k) => k.provider === provider);
	}

	function isValid(provider: ModelProvider): boolean {
		return $apiKeys.find((k) => k.provider === provider)?.valid ?? false;
	}

	let verifyStatus = $state<Record<string, 'idle' | 'checking' | 'ok' | 'fail'>>({});
	let verifyMsg = $state<Record<string, string>>({});

	async function verifyKey(provider: ModelProvider) {
		const key = getApiKey(provider);
		if (!key) return;
		verifyStatus[provider] = 'checking';
		verifyMsg[provider] = '';
		try {
			// Minimal request — send a tiny message to verify auth
			const body: Record<string, unknown> = {
				model: provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : provider === 'gemini' ? 'gemini-2.0-flash' : provider === 'groq' ? 'llama-3.3-70b-versatile' : provider === 'openrouter' ? 'openrouter/auto' : provider === 'mistral' ? 'mistral-large-latest' : provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o',
				messages: [{ role: 'user', content: 'test' }],
				max_tokens: 1,
				stream: false
			};
			if (provider === 'anthropic') {
				Object.assign(body, { system: '', max_tokens: 1 });
			}
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (provider === 'anthropic') {
				headers['x-api-key'] = key;
			} else {
				headers['Authorization'] = `Bearer ${key}`;
			}
			const res = await fetch(`${WORKER_PROXY}/api/${provider}`, {
				method: 'POST',
				headers,
				body: JSON.stringify(body)
			});
			if (res.ok || res.status === 200) {
				verifyStatus[provider] = 'ok';
				verifyMsg[provider] = $i18n('apikeys.valid');
			} else if (res.status === 401 || res.status === 403) {
				verifyStatus[provider] = 'fail';
				verifyMsg[provider] = $i18n('apikeys.invalid');
			} else if (res.status === 429) {
				// Rate limited means the key is valid
				verifyStatus[provider] = 'ok';
				verifyMsg[provider] = $i18n('apikeys.validRateLimited');
			} else {
				verifyStatus[provider] = 'ok';
				verifyMsg[provider] = `✓ ${res.status} (${$i18n('apikeys.accepted')})`;
			}
		} catch {
			verifyStatus[provider] = 'fail';
			verifyMsg[provider] = $i18n('apikeys.connectionError');
		}
		setTimeout(() => { verifyStatus[provider] = 'idle'; verifyMsg[provider] = ''; }, 5000);
	}
</script>

<div class="space-y-3">
	<h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">{$i18n('apikeys.title')}</h3>

	{#each PROVIDERS as prov (prov.id)}
		<div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="w-2.5 h-2.5 rounded-full" style="background: {prov.color}"></span>
					<span class="text-sm font-medium">{prov.name}</span>
					{#if hasKey(prov.id)}
						<span class="px-1.5 py-0.5 text-[10px] rounded-full {isValid(prov.id) ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
							{isValid(prov.id) ? $i18n('apikeys.active') : $i18n('apikeys.review')}
						</span>
					{/if}
				</div>

				<div class="flex items-center gap-1">
					{#if hasKey(prov.id)}
						<button
							type="button"
							aria-label="{$i18n('apikeys.verifyOf')} {prov.name}"
							class="p-1 text-slate-500 hover:text-green-400 transition-colors {verifyStatus[prov.id] === 'checking' ? 'animate-pulse' : ''}"
							onclick={() => verifyKey(prov.id)}
							disabled={verifyStatus[prov.id] === 'checking'}
							title={$i18n('apikeys.verify')}
						>
							{#if verifyStatus[prov.id] === 'ok'}
								<span class="text-green-400 text-xs">✓</span>
							{:else if verifyStatus[prov.id] === 'fail'}
								<span class="text-red-400 text-xs">✗</span>
							{:else}
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{/if}
						</button>
						<button
							type="button"
							aria-label="{showKey[prov.id] ? $i18n('apikeys.hide') : $i18n('apikeys.show')} {$i18n('apikeys.keyOf')} {prov.name}"
							class="p-1 text-slate-500 hover:text-slate-300 transition-colors"
							onclick={() => toggleShow(prov.id)}
						>
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								{#if showKey[prov.id]}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								{:else}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								{/if}
							</svg>
						</button>
						<button
							type="button"
							aria-label="{$i18n('apikeys.deleteOf')} {prov.name}"
							class="p-1 text-slate-500 hover:text-red-400 transition-colors"
							onclick={() => remove(prov.id)}
						>
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					{/if}
					<button
						type="button"
						aria-label="{$i18n('apikeys.editOf')} {prov.name}"
						class="p-1 text-slate-500 hover:text-blue-400 transition-colors"
						onclick={() => startEdit(prov.id)}
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Show encrypted key preview -->
			{#if hasKey(prov.id) && showKey[prov.id]}
				<div class="mt-2 text-xs text-slate-500 font-mono bg-slate-900 rounded-lg px-3 py-2 break-all">
					{getApiKey(prov.id)?.slice(0, 8)}{'•'.repeat(20)}{getApiKey(prov.id)?.slice(-4)}
				</div>
			{/if}

			<!-- Verify result -->
			{#if verifyMsg[prov.id]}
				<p class="mt-1 text-xs {verifyStatus[prov.id] === 'ok' ? 'text-green-400' : 'text-red-400'} px-1">{verifyMsg[prov.id]}</p>
			{/if}

			<!-- Edit form -->
			{#if editingProvider === prov.id}
				<div class="mt-3 space-y-1 animate-fade-in">
					<div class="flex gap-2">
						<input
							type="password"
							bind:value={keyInput}
							placeholder={prov.placeholder}
							aria-label="{$i18n('apikeys.apiKeyOf')} {prov.name}"
							class="flex-1 bg-slate-900 rounded-lg px-3 py-2 text-sm border {keyError ? 'border-red-500' : 'border-slate-600'} focus:border-blue-500 focus:outline-none transition-colors font-mono"
							oninput={() => (keyError = '')}
						/>
						<button
							type="button"
							class="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors active:scale-95"
							onclick={save}
						>
							{$i18n('apikeys.save')}
						</button>
						<button
							type="button"
							class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
							onclick={cancel}
						>
							{$i18n('apikeys.cancel')}
						</button>
					</div>
					{#if keyError}
						<p class="text-xs text-red-400 px-1">{keyError}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>
