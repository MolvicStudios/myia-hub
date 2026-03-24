<script lang="ts">
	import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ExportMenu from '$lib/components/ExportMenu.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import {
		activeChat,
		activeMessages,
		activeChatId
	} from '$lib/stores/chatStore';
	import { avatarState, selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { abortActiveRequest } from '$lib/models/router';
	import { handleSendMessage } from '$lib/utils/chatActions';
	import { i18n } from '$lib/stores/i18nStore';
	import type { FileAttachment } from '$lib/types';
	import { tick } from 'svelte';

	let chatContainerEl: HTMLDivElement | undefined = $state();
	let exportOpen = $state(false);

	let userScrolledUp = $state(false);

	function handleScroll() {
		if (!chatContainerEl) return;
		const { scrollTop, scrollHeight, clientHeight } = chatContainerEl;
		userScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
	}

	async function scrollToBottom(force = false) {
		await tick();
		if (chatContainerEl && (force || !userScrolledUp)) {
			chatContainerEl.scrollTo({ top: chatContainerEl.scrollHeight, behavior: 'smooth' });
		}
	}

	async function handleSend(data: { text: string; files: FileAttachment[]; mentions: string[] }) {
		if (!$activeChatId) return;
		await handleSendMessage({ ...data, scrollToBottom });
	}
</script>

<svelte:head>
	<title>MyIA Hub — Chat con IA multimodelo gratis y sin registro</title>
	<meta name="description" content="Chat con ChatGPT, Claude, Gemini, Mistral, DeepSeek, Groq y Ollama desde una sola app. Gratis y sin registro." />
</svelte:head>

{#if !$activeChat}
	<WelcomeScreen />
{:else}
	<div class="flex flex-col h-full">
		<!-- Chat header -->
		<div class="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
			<div class="flex items-center gap-2 min-w-0">
				<h1 class="sr-only">Chat — MyIA Hub</h1>
				<h2 class="text-sm font-medium truncate">{$activeChat.title}</h2>
			</div>
			<div class="flex items-center gap-1">
				<button
					type="button"
					aria-label={$i18n('layout.exportConversation')}
					class="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300 text-xs"
					onclick={() => (exportOpen = true)}
					title={$i18n('layout.export')}
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Messages -->
		<div
			bind:this={chatContainerEl}
			onscroll={handleScroll}
			class="flex-1 overflow-y-auto"
			role="log"
			aria-live="polite"
			aria-label={$i18n('chat.messages')}
		>
			{#if $activeMessages.length === 0}
				<div class="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
					<Avatar model={$selectedModel} provider={$selectedProvider} state="idle" size="lg" />
					<p class="mt-4">{$i18n('chat.startConversation')}</p>
				</div>
			{:else}
				<div class="py-4">
					{#each $activeMessages as msg (msg.id)}
						<ChatMessage message={msg} provider={msg.provider ?? ($selectedProvider)} />
					{/each}

					<!-- Typing indicator -->
					{#if $avatarState === 'typing' || $avatarState === 'loading'}
					<div class="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 animate-fade-in" role="status" aria-label="{$avatarState === 'loading' ? $i18n('chat.thinking') : $i18n('chat.writing')}">
						<Avatar model={$selectedModel} provider={$selectedProvider} state={$avatarState} size="sm" />
						<span>{$avatarState === 'loading' ? $i18n('chat.thinking') : $i18n('chat.writing')}</span>
						<button
							type="button"
							class="ml-2 px-2 py-0.5 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
							onclick={() => { abortActiveRequest(); $avatarState = 'idle'; }}
							aria-label={$i18n('chat.cancelGeneration')}
						>
							{$i18n('chat.cancel')}
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		{#if userScrolledUp}
			<div class="flex justify-center -mt-12 relative z-10 pointer-events-none">
				<button
					type="button"
					class="pointer-events-auto px-3 py-1.5 bg-slate-700/90 hover:bg-slate-600 backdrop-blur-sm text-slate-200 text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5"
					onclick={() => scrollToBottom(true)}
				>
					<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
					↓
				</button>
			</div>
		{/if}

		<!-- Input -->
		<ChatInput
			onsend={handleSend}
			disabled={$avatarState === 'loading' || $avatarState === 'typing'}
		/>
	</div>

	<ExportMenu bind:open={exportOpen} chat={$activeChat} />
{/if}
