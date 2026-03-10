<script lang="ts">
import { page } from '$app/state';
import ChatMessage from '$lib/components/ChatMessage.svelte';
import ChatInput from '$lib/components/ChatInput.svelte';
import ExportMenu from '$lib/components/ExportMenu.svelte';
import Avatar from '$lib/components/Avatar.svelte';
import {
chats,
activeChatId
} from '$lib/stores/chatStore';
import { avatarState, selectedModel, selectedProvider } from '$lib/stores/uiStore';
import { abortActiveRequest } from '$lib/models/router';
import { handleSendMessage } from '$lib/utils/chatActions';
import type { FileAttachment } from '$lib/types';
import { tick, onMount } from 'svelte';

let chatContainerEl: HTMLDivElement | undefined = $state();
let exportOpen = $state(false);

// Resolve chat from URL param
let chatId = $derived(page.params.id);

let chat = $derived($chats.find((c) => c.id === chatId) ?? null);
let messages = $derived(chat?.messages ?? []);

onMount(() => {
if (chatId) {
$activeChatId = chatId;
}
});

async function scrollToBottom() {
await tick();
chatContainerEl?.scrollTo({ top: chatContainerEl.scrollHeight, behavior: 'smooth' });
}

async function handleSend(data: { text: string; files: FileAttachment[]; mentions: string[] }) {
if (!chatId) return;
$activeChatId = chatId;
await handleSendMessage({ ...data, getMessages: () => messages, scrollToBottom });
}
</script>

{#if chat}
<div class="flex flex-col h-full">
<!-- Chat header -->
<div class="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
<h2 class="text-sm font-medium truncate">{chat.title}</h2>
<button
type="button"
aria-label="Exportar conversación"
class="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300"
onclick={() => (exportOpen = true)}
title="Exportar"
>
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>
</button>
</div>

<!-- Messages -->
<div bind:this={chatContainerEl} class="flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="Mensajes de la conversación">
{#if messages.length === 0}
<div class="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
<Avatar model={$selectedModel} provider={$selectedProvider} state="idle" size="lg" />
<p class="mt-4">Comienza la conversación</p>
</div>
{:else}
<div class="py-4">
{#each messages as msg (msg.id)}
<ChatMessage message={msg} provider={msg.provider ?? $selectedProvider} />
{/each}

{#if $avatarState === 'typing' || $avatarState === 'loading'}
<div class="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 animate-fade-in" role="status" aria-label="El modelo está {$avatarState === 'loading' ? 'pensando' : 'escribiendo'}">
<Avatar model={$selectedModel} provider={$selectedProvider} state={$avatarState} size="sm" />
<span>{$avatarState === 'loading' ? 'Pensando…' : 'Escribiendo…'}</span>
<button
type="button"
class="ml-2 px-2 py-0.5 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
onclick={() => { abortActiveRequest(); $avatarState = 'idle'; }}
aria-label="Cancelar generación"
>
Cancelar
</button>
</div>
{/if}
</div>
{/if}
</div>

<ChatInput
onsend={handleSend}
disabled={$avatarState === 'loading' || $avatarState === 'typing'}
/>
</div>

<ExportMenu bind:open={exportOpen} {chat} />
{:else}
<div class="flex items-center justify-center h-full text-slate-500">
Chat no encontrado
</div>
{/if}
