<script lang="ts">
	export let value: boolean = undefined;
	export let classes: string = '';

	function getColour() {
		if (value != undefined) {
			return value ? 'bg-green-500' : 'bg-red-500';
		} else {
			return '';
		}
	}
</script>

<div
	class="h-3 w-3 border-2 {classes} rounded dark:border-dark-text {getColour()} border-light-text flex-shrink-0"
/>
