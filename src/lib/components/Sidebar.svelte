<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		chats,
		activeChatId,
		createChat,
		renameChat,
		deleteChat
	} from '$lib/stores/chatStore';
	import { selectedModel, selectedProvider } from '$lib/stores/uiStore';
	import { settings, toggleSidebar } from '$lib/stores/settingsStore';

	let editingId = $state<string | null>(null);
	let editTitle = $state('');

	function newChat() {
		const id = createChat($selectedModel, $selectedProvider);
		goto(`/chat/${id}`);
	}

	function selectChat(id: string) {
		$activeChatId = id;
		goto(`/chat/${id}`);
		// On mobile, close sidebar
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			toggleSidebar();
		}
	}

	function startRename(id: string, currentTitle: string) {
		editingId = id;
		editTitle = currentTitle;
	}

	function commitRename(id: string) {
		if (editTitle.trim()) {
			renameChat(id, editTitle.trim());
		}
		editingId = null;
	}

	function handleRenameKeydown(e: KeyboardEvent, id: string) {
		if (e.key === 'Enter') commitRename(id);
		if (e.key === 'Escape') editingId = null;
	}

	function confirmDelete(id: string) {
		if (confirm('¿Eliminar este chat? Esta acción no se puede deshacer.')) {
			deleteChat(id);
		}
	}

	const MODEL_COLORS: Record<string, string> = {
		openai: '#10a37f',
		anthropic: '#d97706',
		gemini: '#4285f4',
		mistral: '#ff7000',
		deepseek: '#5b6abf',
		groq: '#f55036',
		openrouter: '#8b5cf6',
		ollama: '#1e88e5'
	};
</script>

<aside
	class="flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300
	{$settings.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}"
	aria-label="Barra lateral de chats"
	role="navigation"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-3 border-b border-slate-800">
		<h2 class="text-sm font-semibold text-slate-300 truncate">Chats</h2>
		<div class="flex items-center gap-1">
			<button
				type="button"
				class="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
				onclick={newChat}
				title="Nuevo chat"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
			</button>
			<button
				type="button"
				class="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 md:hidden"
				onclick={toggleSidebar}
				title="Cerrar sidebar"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Chat list -->
	<div class="flex-1 overflow-y-auto py-2" role="list" aria-label="Lista de conversaciones">
		{#each $chats as chat (chat.id)}
			<div
				class="group flex items-center gap-2 mx-2 mb-0.5 rounded-lg transition-all duration-200 cursor-pointer
				{chat.id === $activeChatId ? 'bg-slate-800' : 'hover:bg-slate-800/50'}"
				role="listitem"
			>
				<button
					type="button"
					aria-current={chat.id === $activeChatId ? 'true' : undefined}
					class="flex-1 flex items-center gap-2 px-3 py-2.5 min-w-0 text-left"
					onclick={() => selectChat(chat.id)}
				>
					<span
						class="w-2 h-2 rounded-full shrink-0"
						style="background: {MODEL_COLORS[chat.provider] ?? '#64748b'}"
					></span>
					<div class="flex-1 min-w-0">
						{#if editingId === chat.id}
							<input
								type="text"
								bind:value={editTitle}
								onblur={() => commitRename(chat.id)}
								onkeydown={(e) => handleRenameKeydown(e, chat.id)}
								class="w-full bg-slate-700 rounded px-1 py-0.5 text-sm focus:outline-none"
							/>
						{:else}
							<div class="text-sm truncate">{chat.title}</div>
							<time datetime={new Date(chat.updatedAt).toISOString()} class="text-[10px] text-slate-400">
								{new Date(chat.updatedAt).toLocaleDateString()}
							</time>
						{/if}
					</div>
				</button>

				<!-- Actions (visible on hover) -->
				<div class="hidden group-hover:flex group-focus-within:flex items-center gap-0.5 pr-2">
					<button
						type="button"
						aria-label="Renombrar chat {chat.title}"
						class="p-1 text-slate-500 hover:text-slate-300 transition-colors"
						onclick={() => startRename(chat.id, chat.title)}
						title="Renombrar"
					>
						<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</button>
					<button
						type="button"
						aria-label="Eliminar chat {chat.title}"
						class="p-1 text-slate-500 hover:text-red-400 transition-colors"
						onclick={() => confirmDelete(chat.id)}
						title="Eliminar"
					>
						<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>
		{/each}

		{#if $chats.length === 0}
			<div class="px-4 py-8 text-center text-sm text-slate-500">
				No hay chats aún.<br />
				<button type="button" class="text-blue-400 hover:text-blue-300 mt-1" onclick={newChat}>
					Crear nuevo chat
				</button>
			</div>
		{/if}
	</div>
</aside>
