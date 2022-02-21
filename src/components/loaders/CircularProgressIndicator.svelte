<script lang="ts">
	export let variant: 'dark' | 'light' = 'light';
</script>

<div
	class="loader h-5 w-5 {variant == 'light' ? 'border-brand-text' : 'border-brand-background'}"
	data-testid="loader"
/>

<style>
	.loader {
		border-width: 2px;
		border-style: solid;
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
