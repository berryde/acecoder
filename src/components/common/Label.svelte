<script lang="ts">
	export let variant: 'dark' | 'accent' = 'dark';

	function getColor() {
		switch (variant) {
			case 'accent':
				return 'bg-brand-accent';
			default:
				return 'bg-brand-editor-background';
		}
	}
</script>

<div
	in:scale
	out:fade
	class="absolute bg-brand-editor-background min-w-max origin-center left-1/2 -translate-x-1/2  z-30 transition-opacity mt-2 rounded px-2 py-1 transform text-xs duration-300 shadow-xl"
>
	<slot />
</div>
