<script lang="ts">
	/**
	 * The color of the indicator
	 */
	export let variant: 'dark' | 'light' = 'light';
</script>

<div
	class="loader border-2 border-solid inline-block h-5 w-5 {variant == 'light'
		? 'border-brand-text'
		: 'border-brand-background'}"
	data-testid="loader"
/>

<style>
	.loader {
		border-bottom-color: transparent;
		border-radius: 50%;
		box-sizing: border-box;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
