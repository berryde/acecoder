<div class="loader h-5 w-5 dark:border-dark-text border-light-text" data-testid="loader" />

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
