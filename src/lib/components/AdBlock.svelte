<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
		minHeight?: number;
		class?: string;
	}

	let { format = 'auto', minHeight = 100, class: className = '' }: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let loaded = $state(false);

	function hasAdConsent(): boolean {
		try {
			return localStorage.getItem('myia_cookie_consent') === 'accepted';
		} catch {
			return false;
		}
	}

	onMount(() => {
		if (!browser || !hasAdConsent()) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !loaded) {
					loaded = true;
					observer.disconnect();
					try {
						((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
					} catch {
						// AdSense not available
					}
				}
			},
			{ rootMargin: '200px' }
		);

		if (containerEl) observer.observe(containerEl);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerEl}
	class="ad-block w-full flex items-center justify-center {className}"
	style="min-height: {minHeight}px;"
	aria-hidden="true"
>
	{#if loaded}
		<ins class="adsbygoogle"
			style="display:block"
			data-ad-client="ca-pub-1513893788851225"
			data-ad-slot="7933598081"
			data-ad-format={format}
			data-full-width-responsive="true"></ins>
	{/if}
</div>
