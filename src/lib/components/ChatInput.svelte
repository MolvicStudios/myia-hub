<script lang="ts">
	import type { FileAttachment } from '$lib/types';
	import { getModelSuggestions, isInMentionContext } from '$lib/utils/mentionParser';
	import { fileToAttachment, validateFile, getFileIcon, formatFileSize } from '$lib/utils/fileUtils';
	import type { ModelDef } from '$lib/types';
	import PromptLibrary from './PromptLibrary.svelte';
	import { i18n } from '$lib/stores/i18nStore';

	import { debounce } from '$lib/utils/perf';

	interface Props {
		onsend?: (data: { text: string; files: FileAttachment[]; mentions: string[] }) => void;
		disabled?: boolean;
	}

	let { onsend, disabled = false }: Props = $props();

	let text = $state('');
	let files = $state<FileAttachment[]>([]);
	let textareaEl: HTMLTextAreaElement | undefined = $state();
	let showSuggestions = $state(false);
	let suggestions = $state<ModelDef[]>([]);
	let suggestionIdx = $state(-1);
	let dragOver = $state(false);

	function autoResize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = Math.min(textareaEl.scrollHeight, 200) + 'px';
	}

	function handleInput() {
		autoResize();
		debouncedCheckMentions();
	}

	const debouncedCheckMentions = debounce(checkMentions, 150);

	function checkMentions() {
		if (!textareaEl) return;
		const pos = textareaEl.selectionStart;
		const ctx = isInMentionContext(text, pos);
		if (ctx.active) {
			suggestions = getModelSuggestions(ctx.query);
			showSuggestions = suggestions.length > 0;
			suggestionIdx = showSuggestions ? 0 : -1;
		} else {
			showSuggestions = false;
			suggestionIdx = -1;
		}
	}

	function insertMention(model: ModelDef) {
		if (!textareaEl) return;
		const pos = textareaEl.selectionStart;
		const before = text.slice(0, pos);
		const after = text.slice(pos);
		const atIdx = before.lastIndexOf('@');
		if (atIdx !== -1) {
			text = before.slice(0, atIdx) + `@${model.alias} ` + after;
		}
		showSuggestions = false;
		suggestionIdx = -1;
		textareaEl.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showSuggestions) {
			const max = Math.min(suggestions.length, 15) - 1;
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					suggestionIdx = Math.min(suggestionIdx + 1, max);
					return;
				case 'ArrowUp':
					e.preventDefault();
					suggestionIdx = Math.max(suggestionIdx - 1, 0);
					return;
				case 'Enter':
				case 'Tab':
					if (suggestionIdx >= 0 && suggestionIdx <= max) {
						e.preventDefault();
						insertMention(suggestions[suggestionIdx]);
						return;
					}
					break;
				case 'Escape':
					e.preventDefault();
					showSuggestions = false;
					suggestionIdx = -1;
					return;
			}
		}
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	function send() {
		if ((!text.trim() && files.length === 0) || disabled) return;

		// Extract mentions from text
		const mentionMatches = [...text.matchAll(/@([\w-]+)/g)].map((m) => m[1]);

		onsend?.({ text: text.trim(), files: [...files], mentions: mentionMatches });
		text = '';
		files = [];
		if (textareaEl) {
			textareaEl.style.height = 'auto';
		}
	}

	async function handleFiles(fileList: FileList | null) {
		if (!fileList) return;
		for (const file of fileList) {
			const validation = validateFile(file);
			if (!validation.valid) continue;
			const attachment = await fileToAttachment(file);
			files = [...files, attachment];
		}
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}
</script>

<div
	class="relative border-t border-slate-800 bg-slate-900/50"
	role="region"
	aria-label={$i18n('chat.inputArea')}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<!-- Drag overlay -->
	{#if dragOver}
		<div class="absolute inset-0 z-20 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center">
			<span class="text-blue-400 font-medium">{$i18n('chat.dropFiles')}</span>
		</div>
	{/if}

	<!-- Mention suggestions popup -->
	{#if showSuggestions}
		<div class="absolute bottom-full left-4 mb-2 w-64 max-h-80 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl animate-scale-in z-50" role="listbox" aria-label={$i18n('chat.modelSuggestions')}>
			{#each suggestions.slice(0, 15) as model, idx (model.id)}
				<button
					type="button"
					role="option"
					aria-selected={idx === suggestionIdx}
					class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-left text-sm transition-colors"
					class:bg-slate-700={idx === suggestionIdx}
					onclick={() => insertMention(model)}
				>
					<span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: {model.color}"></span>
					<span class="font-medium">{model.name}</span>
					<span class="text-xs text-slate-500">@{model.alias}</span>
				</button>
			{/each}
		</div>
	{/if}

	<!-- File previews -->
	{#if files.length > 0}
		<div class="flex gap-2 px-4 pt-3 overflow-x-auto">
			{#each files as file, i (i)}
				<div class="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 text-xs shrink-0 animate-scale-in">
					{#if file.type.startsWith('image/') && file.preview}
						<img src={file.preview} alt={file.name} class="w-8 h-8 rounded object-cover" />
					{:else}
						<span class="text-base">{getFileIcon(file.type)}</span>
					{/if}
					<div class="min-w-0">
						<div class="truncate max-w-24">{file.name}</div>
						<div class="text-slate-500">{formatFileSize(file.size)}</div>
					</div>
					<button
						type="button"
						aria-label="{$i18n('chat.removeFile')} {file.name}"
						class="text-slate-500 hover:text-red-400 transition-colors"
						onclick={() => removeFile(i)}
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Input row -->
	<div class="flex items-end gap-2 p-3">
		<!-- File upload button -->
		<label class="shrink-0 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors text-slate-400 hover:text-slate-200" aria-label={$i18n('chat.attachFiles')}>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
			</svg>
			<input type="file" class="hidden" multiple onchange={(e) => handleFiles((e.target as HTMLInputElement).files)} aria-label={$i18n('chat.selectFiles')} />
		</label>

		<!-- Saved prompts -->
		<PromptLibrary onSelect={(t) => { text = t; textareaEl?.focus(); }} />

		<!-- Textarea -->
		<textarea
			bind:this={textareaEl}
			bind:value={text}
			oninput={handleInput}
			onkeydown={handleKeydown}
			placeholder={$i18n('chat.placeholder')}
			aria-label={$i18n('chat.chatMessage')}
			rows="1"
			class="flex-1 resize-none bg-slate-800 rounded-xl px-4 py-3 text-sm border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500"
			{disabled}
		></textarea>

		<!-- Send button -->
		<button
			type="button"
			aria-label={$i18n('chat.send')}
			class="shrink-0 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
			onclick={send}
			disabled={disabled || (!text.trim() && files.length === 0)}
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7" />
			</svg>
		</button>
	</div>
</div>
