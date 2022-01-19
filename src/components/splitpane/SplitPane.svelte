<script lang="ts">
	/**
	 * Svelte split pane component, inspired by https://github.com/Readiz/svelte-split-pane.
	 */
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Separator from './Separator.svelte';

	/**
	 * The size of the left pane as a percentage of the split pane's width.
	 */
	export let pane1Size = 50;

	/**
	 * The size of the right pane as a percentage of the split pane's width.
	 */
	export let pane2Size = 50;

	/**
	 * The minimum allowed size of the left pane as a CSS string.
	 */
	export let minPane1Size = '0';

	/**
	 * The minimum allowed size of the right pane as a CSS string.
	 */
	export let minPane2Size = '0';

	/**
	 * The left pane.
	 */
	let pane1: HTMLDivElement;

	/**
	 * The right pane.
	 */
	let pane2: HTMLDivElement;

	/**
	 * The separator.
	 */
	let separator: HTMLDivElement;

	/**
	 * Memoized data about the mouse event that started a drag.
	 */
	let mouseData: {
		event: MouseEvent;
		offset: number;
		pane1Size: number;
		pane2Size: number;
	};

	/**
	 * Whether the user is currently dragging the separator.
	 */
	let resizing = false;

	const dispatch = createEventDispatcher();

	/**
	 * Called when the user drags the separator.
	 * @param e The mouse event for this drag.
	 */
	function mouseMove(e: MouseEvent) {
		e.preventDefault();
		if (e.button !== 0) return;

		/**
		 * The distance from the original mouse position to the current position.
		 */
		const delta = {
			/**
			 * The horizontal offset.
			 */
			x: e.clientX - mouseData.event.clientX,
			/**
			 * The vertical offset.
			 */
			y: e.clientY - mouseData.event.clientY
		};

		delta.x = Math.min(Math.max(delta.x, -mouseData.pane1Size), mouseData.pane2Size);

		const left = ((mouseData.pane1Size + delta.x) / width) * 100;
		const right = 100 - left - separatorSize;
		pane1Size = left;
		pane2Size = right;
		pane1.style.width = left + '%';
		pane2.style.width = right + '%';
	}

	/**
	 * Called when the user stops dragging the separator.
	 * @param e The mouse event for stopping the drag.
	 */
	function mouseUp(e: MouseEvent) {
		if (e) {
			e.preventDefault();
			if (e.button !== 0) return;
		}
		if (window) {
			resizing = false;
			window.removeEventListener('mousemove', mouseMove);
			window.removeEventListener('mouseup', mouseUp);
		}
	}

	/**
	 * Called when the user clicks on the separator.
	 * This should start the resizing event.
	 * @param e The event of the user clicking on the separator.
	 */
	function mouseDown(e: MouseEvent) {
		e.preventDefault();
		if (e.button !== 0) return;
		mouseData = {
			event: e,
			offset: separator.offsetLeft,
			pane1Size: pane1.offsetWidth,
			pane2Size: pane2.offsetWidth
		};
		if (window) {
			resizing = true;
			window.addEventListener('mousemove', mouseMove);
			window.addEventListener('mouseup', mouseUp);
			dispatch('resize');
		}
	}

	/**
	 * Called when the application is resized.
	 */
	function resize() {
		mouseUp(undefined);
		resetSize();
	}

	/**
	 * Add a resize listener to reset the split ratio.
	 */
	onMount(() => {
		if (window) {
			window.addEventListener('resize', resize);
		}
		separatorSize = getSeparatorSize();
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize);
		window.removeEventListener('mousemove', mouseMove);
		window.removeEventListener('mouseup', mouseUp);
	});

	/**
	 * Revert to the default split.
	 */
	function resetSize() {
		if (pane1) pane1.removeAttribute('style');
		if (pane2) pane2.removeAttribute('style');
		if (separator) separator.removeAttribute('style');
	}

	function getSeparatorSize() {
		if (separator) {
			return (separator.clientWidth / width) * 100;
		}
		return 0;
	}

	$: pane1Size && resetSize();
	$: pane2Size && resetSize();
	$: minPane1Size && resetSize();

	let width: number;
	let separatorSize: number;
</script>

<div
	class="flex flex-row flex-grow overflow-y-auto"
	style="--left-pane-size: {pane1Size}%; --right-pane-size: {pane2Size}%; --min-left-pane-size: {minPane1Size}; --min-right-pane-size: {minPane2Size};"
	bind:clientWidth={width}
>
	<div bind:this={pane1} class="pane1 overflow-auto h-full">
		<slot name="pane1" {resizing} />
	</div>
	<div bind:this={separator} on:mousedown={mouseDown} on:mouseup={mouseUp}>
		<Separator />
	</div>
	<div bind:this={pane2} class="pane2 h-full">
		<slot name="pane2" {resizing} />
	</div>
</div>

<style lang="postcss">
	.pane1 {
		width: var(--left-pane-size);
		min-width: var(--min-left-pane-size);
	}
	.pane2 {
		width: var(--right-pane-size);
		min-width: var(--min-right-pane-size);
	}
</style>
