<script lang="ts">
	import { createChat } from '$lib/stores/chatStore';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { goto } from '$app/navigation';
	import type { ModelProvider } from '$lib/types';

	const providers = [
		{
			name: 'OpenAI',
			id: 'openai' as ModelProvider,
			icon: '🟢',
			color: '#10a37f',
			description: 'GPT-4, GPT-4o — Los modelos más populares del mercado.',
			free: false,
			freeCredits: '$5 al registrarte',
			url: 'https://platform.openai.com/api-keys',
			steps: ['Crea una cuenta en platform.openai.com', 'Ve a API Keys → Create new secret key', 'Copia la clave y pégala en Configuración → APIs']
		},
		{
			name: 'Anthropic (Claude)',
			id: 'anthropic' as ModelProvider,
			icon: '🟠',
			color: '#d97706',
			description: 'Claude Sonnet 4, Claude 3.5 — Excelente para código y razonamiento.',
			free: false,
			freeCredits: '$5 al registrarte',
			url: 'https://console.anthropic.com/settings/keys',
			steps: ['Crea cuenta en console.anthropic.com', 'Ve a Settings → API Keys → Create Key', 'Copia la clave sk-ant-... y pégala aquí']
		},
		{
			name: 'Google Gemini',
			id: 'gemini' as ModelProvider,
			icon: '🔵',
			color: '#4285f4',
			description: 'Gemini 2.0 Flash — Rápido y gratuito con generoso límite.',
			free: true,
			freeCredits: 'Gratis (60 req/min)',
			url: 'https://aistudio.google.com/app/apikey',
			steps: ['Inicia sesión con tu cuenta de Google', 'Click en "Create API Key"', '¡Listo! Es el proveedor más fácil de empezar']
		},
		{
			name: 'Groq',
			id: 'groq' as ModelProvider,
			icon: '🔴',
			color: '#f55036',
			description: 'Llama 3.3 70B — Inferencia ultrarrápida y gratuita.',
			free: true,
			freeCredits: 'Gratis (30 req/min)',
			url: 'https://console.groq.com/keys',
			steps: ['Regístrate en console.groq.com', 'Ve a API Keys → Create API Key', 'La clave empieza por gsk_...']
		},
		{
			name: 'Mistral',
			id: 'mistral' as ModelProvider,
			icon: '🟧',
			color: '#ff7000',
			description: 'Mistral Large — Modelo europeo de alto rendimiento.',
			free: false,
			freeCredits: '€5 al registrarte',
			url: 'https://console.mistral.ai/api-keys',
			steps: ['Crea cuenta en console.mistral.ai', 'Ve a API Keys → Create new key', 'Copia la clave y configúrala aquí']
		},
		{
			name: 'DeepSeek',
			id: 'deepseek' as ModelProvider,
			icon: '🔮',
			color: '#5b6abf',
			description: 'DeepSeek Chat — Excelente relación calidad/precio.',
			free: false,
			freeCredits: '$2 al registrarte',
			url: 'https://platform.deepseek.com/api_keys',
			steps: ['Regístrate en platform.deepseek.com', 'Ve a API Keys → Create', 'La clave empieza por sk-...']
		},
		{
			name: 'OpenRouter',
			id: 'openrouter' as ModelProvider,
			icon: '🟣',
			color: '#8b5cf6',
			description: 'Acceso unificado a cientos de modelos con una sola clave.',
			free: false,
			freeCredits: 'Modelos gratis disponibles',
			url: 'https://openrouter.ai/keys',
			steps: ['Regístrate en openrouter.ai', 'Ve a Keys → Create Key', 'La clave empieza por sk-or-...']
		},
		{
			name: 'Ollama (Local)',
			id: 'ollama' as ModelProvider,
			icon: '🦙',
			color: '#1e88e5',
			description: 'Modelos locales — 100% gratis, sin internet, privacidad total.',
			free: true,
			freeCredits: '100% gratis siempre',
			url: 'https://ollama.com/download',
			steps: ['Descarga Ollama desde ollama.com', 'Ejecuta: ollama pull llama3.2:3b', 'No necesitas API key — funciona automáticamente']
		}
	];

	function startWithProvider(provider: ModelProvider) {
		const models: Record<string, string> = {
			openai: 'gpt-4o',
			anthropic: 'claude-sonnet-4-20250514',
			gemini: 'gemini-2.0-flash',
			groq: 'llama-3.3-70b-versatile',
			mistral: 'mistral-large-latest',
			deepseek: 'deepseek-chat',
			openrouter: 'openrouter/auto',
			ollama: 'llama3.2:3b'
		};
		const modelId = models[provider] ?? 'gpt-4o';
		$selectedModel = modelId;
		$selectedProvider = provider;
		const id = createChat(modelId, provider);
		goto(`/chat/${id}`);
	}
</script>

<svelte:head>
	<title>Tutorial — MyIA Hub</title>
	<meta name="description" content="Aprende a configurar MyIA Hub: consigue API keys gratis para ChatGPT, Claude, Gemini, Groq y más." />
</svelte:head>

<main id="main-content" class="max-w-4xl mx-auto px-4 py-12 overflow-y-auto h-full">
	<a href="/" class="text-blue-400 hover:underline text-sm mb-6 inline-block">← Volver al chat</a>

	<div class="text-center mb-12">
		<h1 class="text-3xl font-bold text-white mb-3">🚀 Empieza a usar MyIA Hub</h1>
		<p class="text-slate-400 max-w-lg mx-auto">Configura tus proveedores de IA en minutos. Algunos son <span class="text-emerald-400 font-semibold">completamente gratis</span>.</p>
	</div>

	<!-- Free providers highlight -->
	<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-8">
		<h2 class="text-emerald-400 font-semibold text-sm mb-2">💡 Empieza gratis</h2>
		<p class="text-sm text-slate-300">Recomendamos empezar con <strong>Google Gemini</strong> o <strong>Groq</strong> — ambos son gratuitos y no requieren método de pago.</p>
	</div>

	<!-- Provider cards -->
	<div class="space-y-4 mb-12">
		{#each providers as p (p.id)}
			<div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
				<div class="p-5">
					<div class="flex items-start justify-between gap-4">
						<div class="flex items-center gap-3 min-w-0">
							<span class="text-2xl">{p.icon}</span>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-semibold text-white">{p.name}</h3>
									{#if p.free}
										<span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase">Gratis</span>
									{/if}
								</div>
								<p class="text-sm text-slate-400 mt-0.5">{p.description}</p>
							</div>
						</div>
						<span class="shrink-0 text-xs px-2 py-1 bg-slate-700/50 rounded-lg text-slate-400">{p.freeCredits}</span>
					</div>

					<!-- Steps -->
					<ol class="mt-4 space-y-2 text-sm text-slate-300">
						{#each p.steps as step, i}
							<li class="flex gap-2">
								<span class="shrink-0 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">{i + 1}</span>
								<span>{step}</span>
							</li>
						{/each}
					</ol>

					<!-- Actions -->
					<div class="flex items-center gap-3 mt-4">
						<a
							href={p.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
							style="background: {p.color}20; color: {p.color};"
						>
							Obtener API Key ↗
						</a>
						<button
							type="button"
							class="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
							onclick={() => startWithProvider(p.id)}
						>
							Probar modelo
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Help section -->
	<div class="text-center text-sm text-slate-500 mb-8">
		<p>¿Necesitas ayuda? Visita nuestro <a href="https://github.com/MolvicStudios/myia-hub" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">repositorio en GitHub</a></p>
	</div>
</main>
