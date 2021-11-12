<script lang="ts">
	/**
	 * Data to transfer to the dropzone on drop.
	 */
	export let data: string;
	/**
	 * The drag system this component belongs to. Only dropzones with a matching variant will be valid.
	 */
	export let variant: string;
	function start(e: DragEvent) {
		e.dataTransfer.setData('text', data);
		e.dataTransfer.setData('variant', variant);
	}
</script>

<div draggable={true} on:dragstart={start}>
	<slot />
</div>
