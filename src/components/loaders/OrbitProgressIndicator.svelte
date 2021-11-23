<!-- Loader adapted from https://cssloaders.github.io/ -->
<div class="loader" />

<style>
	.loader {
		width: 24px;
		height: 24px;
		display: block;
		margin: 15px auto;
		position: relative;
		color: #d1d5db;
		box-sizing: border-box;
		animation: rotation 1.5s linear infinite;
	}
	.loader::after,
	.loader::before {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 18px;
		height: 18px;
		top: 50%;
		left: 50%;
		transform: scale(0.5) translate(0, 0);
		background-color: #d1d5db;
		border-radius: 50%;
		animation: loader 1.5s infinite ease-in-out;
	}
	.loader::before {
		background-color: #2563eb;
		transform: scale(0.5) translate(-24px, -24px);
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes loader {
		50% {
			transform: scale(1) translate(-50%, -50%);
		}
	}
</style>
