<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { MODEL_REGISTRY } from '$lib/models/registry';
	import type { AvatarState, ModelProvider } from '$lib/types';

	interface Props {
		state: AvatarState;
		model: string;
		provider: ModelProvider;
	}

	let { state = 'idle', model, provider }: Props = $props();

	const STATE_LABELS: Record<AvatarState, string> = {
		idle: 'Listo',
		loading: 'Pensando…',
		typing: 'Escribiendo…',
		error: 'Error'
	};

	let modelDef = $derived(MODEL_REGISTRY.find((m) => m.id === model));
</script>

<div class="flex items-center gap-2" role="status" aria-live="polite" aria-label="Estado del modelo: {modelDef?.name ?? model} - {STATE_LABELS[state]}">
	<Avatar {model} {provider} {state} size="sm" />
	<div class="hidden sm:block">
		<div class="text-xs font-medium">{modelDef?.name ?? model}</div>
		<div class="text-[10px] text-slate-500">{STATE_LABELS[state]}</div>
	</div>
</div>
