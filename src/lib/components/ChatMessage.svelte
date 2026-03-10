<script lang="ts">
	import type { ChatMessage as Msg, ModelProvider } from '$lib/types';
	import Avatar from './Avatar.svelte';
	import { getFileIcon, formatFileSize } from '$lib/utils/fileUtils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import { estimateTokens, estimateCost, formatCost } from '$lib/utils/tokenCounter';

	interface Props {
		message: Msg;
		provider?: ModelProvider;
	}

	let { message, provider = 'openai' }: Props = $props();

	let isUser = $derived(message.role === 'user');
	let isSystem = $derived(message.role === 'system');

	/** Rendered markdown HTML for assistant messages */
	let renderedHtml = $derived(!isUser ? renderMarkdown(message.content) : '');

	/** Estimated token count */
	let tokens = $derived(estimateTokens(message.content));

	/** Cost estimate for assistant messages */
	let cost = $derived(!isUser && message.model ? formatCost(estimateCost(message.model, 0, tokens)) : '');
</script>

<div
	class="flex gap-3 px-4 py-3 animate-fade-in {isUser ? 'justify-end' : 'justify-start'}"
	class:opacity-60={isSystem}
	role="article"
	aria-label="{isUser ? 'Mensaje del usuario' : isSystem ? 'Mensaje del sistema' : 'Respuesta de ' + (message.model ?? 'asistente')}"
>
	<!-- Assistant avatar -->
	{#if !isUser}
		<div class="shrink-0 mt-1">
			<Avatar model={message.model ?? ''} {provider} state="idle" size="sm" />
		</div>
	{/if}

	<div class="max-w-[75%] min-w-0">
		<!-- Model label for assistant -->
		{#if !isUser && message.model}
			<div class="text-xs text-slate-500 mb-1 pl-1">{message.model}</div>
		{/if}

		<!-- Bubble -->
		<div
			class="rounded-2xl px-4 py-3 text-sm leading-relaxed break-words {isUser
				? 'bg-blue-600 text-white rounded-br-md'
				: 'bg-slate-800 text-slate-100 rounded-bl-md border border-slate-700 markdown-body'}"
		>
			{#if isUser}
				<p class="whitespace-pre-wrap">{message.content}</p>
			{:else}
				{@html renderedHtml}
			{/if}

			<!-- Images -->
			{#if message.images?.length}
				<div class="flex flex-wrap gap-2 mt-2">
					{#each message.images as img}
						<img src={img} alt="Adjunto" loading="lazy" class="max-w-48 max-h-48 rounded-lg object-cover" />
					{/each}
				</div>
			{/if}

			<!-- Attachments -->
			{#if message.attachments?.length}
				<div class="flex flex-col gap-1 mt-2">
					{#each message.attachments as file}
						<div class="flex items-center gap-2 text-xs bg-slate-900/50 rounded-lg px-2 py-1.5">
							<span>{getFileIcon(file.type)}</span>
							<span class="truncate">{file.name}</span>
							<span class="text-slate-500">{formatFileSize(file.size)}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Timestamp + tokens -->
		<div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1 {isUser ? 'justify-end' : 'justify-start'} px-1">
			<time datetime={new Date(message.timestamp).toISOString()}>
				{new Date(message.timestamp).toLocaleTimeString()}
			</time>
			{#if tokens > 0}
				<span title="Tokens estimados">~{tokens} tok</span>
			{/if}
			{#if cost}
				<span title="Coste estimado">{cost}</span>
			{/if}
		</div>
	</div>

	<!-- User avatar placeholder -->
	{#if isUser}
		<div class="shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm" role="img" aria-label="Avatar del usuario">
			👤
		</div>
	{/if}
</div>
