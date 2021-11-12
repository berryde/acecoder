<script lang="ts">
	/**
	 * Svelte split pane component, inspired by https://github.com/Readiz/svelte-split-pane.
	 */
	import { onMount } from 'svelte';

	/**
	 * The size of the left pane as a percentage of the split pane's width.
	 */
	export let leftPaneSize: number = 50;
	/**
	 * The size of the right pane as a percentage of the split pane's width.
	 */
	export let rightPaneSize: number = 50;
	/**
	 * The minimum allowed size of the left pane as a percentage of the split pane's width.
	 */
	export let minLeftPaneSize: number = 0;
	/**
	 * The minimum allowed size of the right pane as a percentage of the split pane's width.
	 */
	export let minRightPaneSize: number = 0;

	/**
	 * The left pane.
	 */
	let left: HTMLDivElement;
	/**
	 * The right pane.
	 */
	let right: HTMLDivElement;
	/**
	 * The separator.
	 */
	let separator: HTMLDivElement;
	/**
	 * Memoized data about the mouse event that started a drag.
	 */
	let mouseData: {
		event: MouseEvent;
		offsetX: number;
		leftWidth: number;
		rightWidth: number;
	};
	/**
	 * Whether the user is currently dragging the separator.
	 */
	let resizing = false;

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

		delta.x = Math.min(Math.max(delta.x, -mouseData.leftWidth), mouseData.rightWidth);
		separator.style.left = mouseData.offsetX + delta.x + 'px';
		left.style.width = mouseData.leftWidth + delta.x + 'px';
		right.style.width = mouseData.rightWidth - delta.x + 'px';
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
			offsetX: separator.offsetLeft,
			leftWidth: left.offsetWidth,
			rightWidth: right.offsetWidth
		};
		if (window) {
			resizing = true;
			window.addEventListener('mousemove', mouseMove);
			window.addEventListener('mouseup', mouseUp);
		}
	}

	/**
	 * Called when the application is resized.
	 */
	function resize() {
		mouseUp(undefined);
		resetSize();
	}

	onMount(() => {
		if (window) {
			window.addEventListener('resize', resize);
		}
	});

	function resetSize() {
		if (left) left.removeAttribute('style');
		if (right) right.removeAttribute('style');
		if (separator) separator.removeAttribute('style');
	}

	$: leftPaneSize && resetSize();
	$: rightPaneSize && resetSize();
</script>

<div
	class="flex flex-row flex-grow"
	style="--left-panel-size: {leftPaneSize}%; --right-panel-size: {rightPaneSize}%; --min-left-panel-size: {minLeftPaneSize}; --min-right-panel-size: {minRightPaneSize};"
>
	<div bind:this={left} class="left">
		<slot name="left" {resizing} />
	</div>
	<div
		bind:this={separator}
		class="bg-bluegray-dark flex flex-col justify-center items-center separator"
		on:mousedown={mouseDown}
		on:mouseup={mouseUp}
	>
		<div
			class="transition-colors w-1 mx-1 h-10  {resizing
				? 'bg-bluegray-light'
				: 'thumb'} rounded flex flex-col justify-center"
		/>
	</div>
	<div bind:this={right} class="right">
		<slot name="right" {resizing} />
	</div>
</div>

<style lang="postcss">
	.left {
		width: var(--left-panel-size);
		min-width: var(--min-left-panel-size);
		height: 100%;
	}
	.right {
		width: var(--right-panel-size);
		min-width: var(--min-right-panel-size);
		height: 100%;
	}
	.separator:hover {
		cursor: w-resize;
	}
	.thumb {
		background-color: #484a4f;
	}
</style>
