<script lang="ts">
	import Hoverable from '../common/Hoverable.svelte';

	export let isHorizontal = true;
	export let resizing = false;
</script>

<Hoverable let:hovering classes={isHorizontal ? 'h-full' : 'w-full'}>
	<div
		class="bg-gray-300 z-50 dark:bg-dark-divider min-w-0 flex {isHorizontal
			? 'flex-col'
			: 'flex-row'} justify-center items-center separator-{isHorizontal
			? 'horizontal'
			: 'vertical'}"
	>
		<div
			class="transition-colors min-w-0 min-h-0 flex-shrink {isHorizontal
				? 'w-1 mx-0.5 h-10'
				: 'h-1 my-0.5 w-10'}  {resizing || hovering
				? 'dark:bg-dark-text bg-light-text'
				: 'dark:bg-dark-bglight bg-light-bglight'} rounded"
		/>
	</div>
</Hoverable>

<style>
	.separator-horizontal {
		height: 100%;
	}
	.separator-horizontal:hover {
		cursor: w-resize;
	}
	.separator-vertical:hover {
		cursor: s-resize;
	}
	.separator-vertical {
		width: 100%;
	}
</style>
