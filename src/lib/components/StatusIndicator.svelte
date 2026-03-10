<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { MODEL_REGISTRY } from '$lib/models/registry';
	import { i18n } from '$lib/stores/i18nStore';
	import type { AvatarState, ModelProvider } from '$lib/types';

	interface Props {
		state: AvatarState;
		model: string;
		provider: ModelProvider;
	}

	let { state = 'idle', model, provider }: Props = $props();

	const STATE_KEYS: Record<AvatarState, string> = {
		idle: 'status.idle',
		loading: 'status.loading',
		typing: 'status.typing',
		error: 'status.error'
	};

	let modelDef = $derived(MODEL_REGISTRY.find((m) => m.id === model));
</script>

<div class="flex items-center gap-2" role="status" aria-live="polite" aria-label="{$i18n('status.label')}: {modelDef?.name ?? model} - {$i18n(STATE_KEYS[state])}">
	<Avatar {model} {provider} {state} size="sm" />
	<div class="hidden sm:block">
		<div class="text-xs font-medium">{modelDef?.name ?? model}</div>
		<div class="text-[10px] text-slate-500">{$i18n(STATE_KEYS[state])}</div>
	</div>
</div>
