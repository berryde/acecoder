<script lang="ts">
	export let variant: 'dark' | 'light' = 'dark';
	export let size: 'regular' | 'large' = 'regular';
	export let withText: boolean = true;

	function getColor() {
		if (variant == 'dark') return '#18203D';
		return '#F0F0F0';
	}

	function getSize() {
		if (size == 'regular') return 'w-4';
		return 'h-7';
	}
</script>

<a
	class="flex flex-row items-center cursor-pointer {variant == 'dark'
		? 'text-brand-accent'
		: 'text-brand-text'} font-sans space-x-1"
	href="/"
>
	<svg
		class="text-blue-500 {getSize()} flex-shrink-0"
		viewBox="0 -2 32 34"
		xmlns="http://www.w3.org/2000/svg"
		fill={getColor()}
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M5.89909 2.95654C3.8599 2.95654 2.20679 4.5875 2.20679 6.5994V27.7702C2.20679 29.782 3.8599 31.4131 5.89909 31.4131H19.48C21.5192 31.4131 23.1723 29.782 23.1723 27.7702V6.5994C23.1723 4.5875 21.5192 2.95654 19.48 2.95654H5.89909ZM17.2872 17.1848C17.2872 15.5932 14.2221 12.4112 12.6896 11.4565C11.157 12.4112 8.09185 15.1512 8.09185 17.1848C8.09185 18.9033 8.66657 20.0489 10.3907 20.0489C11.1628 20.0489 11.7308 19.6301 12.1148 19.1944V21.7674H10.9654V22.9131H14.4137V22.3402V21.7674H13.2643V19.1944C13.6483 19.6301 14.2163 20.0489 14.9884 20.0489C16.7125 20.0489 17.2872 18.7764 17.2872 17.1848Z"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M25.0312 18.2435L29.1936 10.3834C30.1381 8.6002 29.4501 6.3776 27.6571 5.41909L25.0897 4.04646C25.0599 4.03053 25.03 4.01503 25 4C25.0206 4.15562 25.0312 4.31433 25.0312 4.47549V18.2435Z"
		/>
	</svg>
	{#if withText}
		<p class="font-bold {size == 'large' ? 'text-4xl' : 'text-2xl'} tracking-tighter">acecoder</p>
	{/if}
</a>
