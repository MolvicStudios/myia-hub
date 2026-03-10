<script lang="ts">
	import type { ChatMessage as Msg, ModelProvider } from '$lib/types';
	import Avatar from './Avatar.svelte';
	import { getFileIcon, formatFileSize } from '$lib/utils/fileUtils';

	interface Props {
		message: Msg;
		provider?: ModelProvider;
	}

	let { message, provider = 'openai' }: Props = $props();

	let isUser = $derived(message.role === 'user');
	let isSystem = $derived(message.role === 'system');

	/** Simple code block detection for rendering */
	function hasCodeBlock(text: string): boolean {
		return text.includes('```');
	}

	/** Split content into text and code segments */
	function parseContent(text: string): Array<{ type: 'text' | 'code'; content: string; lang?: string }> {
		const parts: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = [];
		const regex = /```(\w*)\n([\s\S]*?)```/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
			}
			parts.push({ type: 'code', content: match[2], lang: match[1] || 'text' });
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < text.length) {
			parts.push({ type: 'text', content: text.slice(lastIndex) });
		}

		return parts.length ? parts : [{ type: 'text', content: text }];
	}

	let segments = $derived(parseContent(message.content));
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
				: 'bg-slate-800 text-slate-100 rounded-bl-md border border-slate-700'}"
		>
			{#each segments as seg}
				{#if seg.type === 'code'}
					<pre class="mt-2 mb-2 p-3 bg-slate-900 rounded-lg overflow-x-auto text-xs font-mono border border-slate-700"><code>{seg.content}</code></pre>
				{:else}
					<p class="whitespace-pre-wrap">{seg.content}</p>
				{/if}
			{/each}

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

		<!-- Timestamp -->
		<time datetime={new Date(message.timestamp).toISOString()} class="block text-[10px] text-slate-500 mt-1 {isUser ? 'text-right' : 'text-left'} px-1">
			{new Date(message.timestamp).toLocaleTimeString()}
		</time>
	</div>

	<!-- User avatar placeholder -->
	{#if isUser}
		<div class="shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm" role="img" aria-label="Avatar del usuario">
			👤
		</div>
	{/if}
</div>
