<script lang="ts">
	export let data: string;
	export let variant: string;
	function start(e: DragEvent) {
		e.dataTransfer.setData('text', data);
		e.dataTransfer.setData('variant', variant);
	}
</script>

<div draggable={true} on:dragstart={start}>
	<slot />
</div>
