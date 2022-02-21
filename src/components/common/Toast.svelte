<script lang="ts">
	import { toastMessage } from 'src/utils/editor/editor';
	import { slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { Tweened, tweened } from 'svelte/motion';

	let visible: boolean = false;
	const duration = 3000;
	let progress: Tweened<number>;

	function show() {
		progress = tweened(0, { duration: duration, easing: linear });
		visible = true;
		progress.set(100);
		setTimeout(() => {
			visible = false;
		}, duration);
	}

	function getColor() {
		switch ($toastMessage.variant) {
			case 'warning':
				return 'bg-yellow-400 text-brand-background';
			case 'danger':
				return 'bg-brand-danger-dark text-red-400';
			case 'info':
				return 'bg-brand-primary text-brand-text';
			default:
				return 'bg-brand-success text-green-200';
		}
	}

	function getSecondaryColor() {
		switch ($toastMessage.variant) {
			case 'warning':
				return 'bg-yellow-500';
			case 'danger':
				return 'bg-red-800 ';
			case 'info':
				return 'bg-blue-900';
			default:
				return 'bg-green-600';
		}
	}

	$: $toastMessage && show();
</script>

{#if visible}
	<div
		class="absolute left-0 right-0 mx-auto max-w-max {getColor()} shadow-xl rounded max-w-min flex z-50"
		transition:slide={{ duration: 300 }}
	>
		<div class="absolute rounded {getSecondaryColor()} h-full" style="width: {$progress}%" />

		<p class="py-1 px-3 z-10">{$toastMessage.message}</p>
	</div>
{/if}
