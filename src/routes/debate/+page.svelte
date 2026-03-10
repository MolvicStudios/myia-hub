<script lang="ts">
	import { browser } from '$app/environment';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';
	import {
		DEFAULT_PARTICIPANTS,
		DEFAULT_TOPIC,
		getReadyParticipants,
		runDebate,
		type DebateMessage,
		type DebateParticipant,
		type DebateConfig
	} from '$lib/utils/debateActions';

	let topic = $state(DEFAULT_TOPIC);
	let rounds = $state(5);
	let running = $state(false);
	let finished = $state(false);
	let messages: DebateMessage[] = $state([]);
	let currentTurn = $state<{ participant: DebateParticipant; round: number } | null>(null);
	let streamingContent = $state('');
	let error = $state('');
	let abortController: AbortController | null = null;
	let containerEl: HTMLDivElement | undefined = $state();

	const participants = DEFAULT_PARTICIPANTS;

	let readiness = $derived(
		browser ? getReadyParticipants(participants) : { ready: participants, missing: [] }
	);

	const COLORS: Record<string, string> = {
		openrouter: 'border-violet-500/40 bg-violet-500/5',
		mistral: 'border-orange-500/40 bg-orange-500/5',
		groq: 'border-red-500/40 bg-red-500/5'
	};

	function scrollToBottom() {
		requestAnimationFrame(() => {
			containerEl?.scrollTo({ top: containerEl.scrollHeight, behavior: 'smooth' });
		});
	}

	async function startDebate() {
		if (running) return;
		running = true;
		finished = false;
		messages = [];
		currentTurn = null;
		streamingContent = '';
		error = '';
		abortController = new AbortController();

		const config: DebateConfig = { topic, participants, rounds };

		await runDebate(
			config,
			{
				onTurnStart(participant, round) {
					currentTurn = { participant, round };
					streamingContent = '';
					scrollToBottom();
				},
				onChunk(text) {
					streamingContent = text;
					scrollToBottom();
				},
				onTurnEnd(msg) {
					messages = [...messages, msg];
					currentTurn = null;
					streamingContent = '';
					scrollToBottom();
				},
				onComplete() {
					running = false;
					finished = true;
					currentTurn = null;
				},
				onError(participant, errMsg) {
					error = `Error en ${participant.name}: ${errMsg}`;
				}
			},
			abortController.signal
		);
	}

	function stopDebate() {
		abortController?.abort();
		running = false;
		currentTurn = null;
	}
</script>

<div class="flex flex-col h-full">
	<!-- Header -->
	<div class="shrink-0 px-4 py-3 border-b border-slate-800/50">
		<h1 class="text-lg font-bold flex items-center gap-2">
			<svg class="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
			</svg>
			Debate Multi-Modelo
		</h1>
		<p class="text-xs text-slate-400 mt-1">3 modelos debaten entre sí, leyendo las respuestas de los demás</p>
	</div>

	<!-- Config panel -->
	{#if !running && !finished}
		<div class="shrink-0 p-4 border-b border-slate-800/50 space-y-4">
			<!-- Participants -->
			<div>
				<label class="text-xs text-slate-400 font-medium mb-2 block">Participantes</label>
				<div class="flex flex-wrap gap-2">
					{#each participants as p}
						{@const hasKey = readiness.ready.some((r) => r.provider === p.provider)}
						<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm">
							<ProviderIcon provider={p.provider} size={16} />
							<span>{p.name}</span>
							{#if hasKey}
								<span class="w-2 h-2 rounded-full bg-green-500" title="API key configurada"></span>
							{:else}
								<span class="w-2 h-2 rounded-full bg-red-500" title="Falta API key"></span>
							{/if}
						</div>
					{/each}
				</div>
				{#if readiness.missing.length > 0}
					<p class="text-xs text-red-400 mt-2">
						Falta API key para: {readiness.missing.map((m) => m.name).join(', ')}.
						Configúrala en Ajustes.
					</p>
				{/if}
			</div>

			<!-- Topic -->
			<div>
				<label for="debate-topic" class="text-xs text-slate-400 font-medium mb-1 block">Tema del debate</label>
				<textarea
					id="debate-topic"
					bind:value={topic}
					rows="3"
					class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none resize-none transition-colors"
				></textarea>
			</div>

			<!-- Rounds -->
			<div class="flex items-center gap-3">
				<label for="debate-rounds" class="text-xs text-slate-400 font-medium">Rondas</label>
				<input
					id="debate-rounds"
					type="number"
					min="1"
					max="10"
					bind:value={rounds}
					class="w-16 bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center focus:border-violet-500 focus:outline-none"
				/>
				<span class="text-xs text-slate-500">({rounds * participants.length} turnos totales)</span>
			</div>

			<!-- Start -->
			<button
				type="button"
				disabled={readiness.missing.length > 0}
				onclick={startDebate}
				class="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-all"
			>
				Iniciar Debate ({rounds} rondas)
			</button>
		</div>
	{/if}

	<!-- Messages area -->
	<div bind:this={containerEl} class="flex-1 overflow-y-auto p-4 space-y-3">
		{#each messages as msg (msg.round + '-' + msg.participant.provider)}
			{@const colorClass = COLORS[msg.participant.provider] ?? 'border-slate-700 bg-slate-800/50'}
			<div class="rounded-xl border p-3 {colorClass} animate-fade-in">
				<div class="flex items-center gap-2 mb-2">
					<ProviderIcon provider={msg.participant.provider} size={18} />
					<span class="text-sm font-semibold">{msg.participant.name}</span>
					<span class="text-xs text-slate-500 ml-auto">Ronda {msg.round}</span>
				</div>
				<p class="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</p>
			</div>
		{/each}

		<!-- Currently streaming -->
		{#if currentTurn}
			{@const colorClass = COLORS[currentTurn.participant.provider] ?? 'border-slate-700 bg-slate-800/50'}
			<div class="rounded-xl border p-3 {colorClass} animate-pulse-subtle">
				<div class="flex items-center gap-2 mb-2">
					<ProviderIcon provider={currentTurn.participant.provider} size={18} />
					<span class="text-sm font-semibold">{currentTurn.participant.name}</span>
					<span class="text-xs text-slate-500 ml-auto">Ronda {currentTurn.round}</span>
					<span class="inline-flex items-center gap-1 text-xs text-blue-400">
						<span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
						Escribiendo…
					</span>
				</div>
				{#if streamingContent}
					<p class="text-sm text-slate-200 whitespace-pre-wrap">{streamingContent}</p>
				{:else}
					<p class="text-sm text-slate-500 italic">Pensando…</p>
				{/if}
			</div>
		{/if}

		{#if error}
			<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
				{error}
			</div>
		{/if}

		{#if finished}
			<div class="text-center py-4 space-y-3">
				<p class="text-sm text-green-400 font-medium">Debate completado — {messages.length} intervenciones</p>
				<button
					type="button"
					onclick={() => { finished = false; messages = []; error = ''; }}
					class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
				>
					Nuevo debate
				</button>
			</div>
		{/if}
	</div>

	<!-- Stop button -->
	{#if running}
		<div class="shrink-0 p-4 border-t border-slate-800/50">
			<button
				type="button"
				onclick={stopDebate}
				class="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm transition-colors"
			>
				Detener debate
			</button>
		</div>
	{/if}
</div>
