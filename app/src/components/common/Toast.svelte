<script lang="ts">
	import { toastMessage } from 'src/utils/editor/editor';
	import { slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { Tweened, tweened } from 'svelte/motion';

	/**
	 * Whether the toast is visible
	 */
	let visible: boolean = false;

	/**
	 * How long the toast should be visible for
	 */
	const duration = 3000;

	/**
	 * The progress of the animation
	 */
	let progress: Tweened<number>;

	/**
	 * Make the toast visible for a duration
	 */
	function show() {
		primary = getColor();
		secondary = getSecondaryColor();
		progress = tweened(0, { duration: duration, easing: linear });
		progress.set(100);
		visible = true;
	}

	/**
	 * Get the background color of the toast
	 */
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

	/**
	 * Get the text color of the toast
	 */
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

	let primary = '';
	let secondary = '';

	$: $progress == 100 && (visible = false);
	$: $toastMessage && show();
</script>

{#if visible}
	<div
		class="absolute left-0 right-0 mx-auto max-w-max {primary} shadow-xl rounded max-w-max flex z-50"
		transition:slide={{ duration: 300 }}
	>
		<div class="absolute rounded {secondary} h-full" style="width: {$progress}%" />
		<p class="py-1 px-3 z-10">{$toastMessage.message}</p>
	</div>
{/if}
