<script lang="ts">
	/**
	 * Data to transfer to the dropzone on drop.
	 */
	export let data: string;
	/**
	 * The drag system this component belongs to. Only dropzones with a matching variant will be valid.
	 */
	export let variant: string;

	export let enabled: boolean = true;

	function start(e: DragEvent) {
		if (enabled && e.dataTransfer) {
			e.dataTransfer.setData('text', data);
			e.dataTransfer.setData('variant', variant);
		} else {
			e.preventDefault();
		}
	}
</script>

<div draggable={enabled} on:dragstart={start}>
	<slot />
</div>
