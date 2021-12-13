<script lang="ts">
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from '../common/Icon.svelte';
	import { result } from 'src/utils/exercise/exercise';
	import Checkbox from './Checkbox.svelte';
	import Error from './Error.svelte';
	import Button from '../common/Button.svelte';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

	function nextExercise() {}

	let visible = true;

	function close() {
		visible = false;
	}

	onMount(async () => {
		await confetti();
	});

	async function reload() {
		visible = true;
		await confetti({
			zIndex: 40
		});
	}

	$: $result && reload();
</script>

<div
	class="absolute left-0 top-0 bg-opacity-50 w-screen h-screen flex justify-center items-center {!visible &&
		'hidden'}"
>
	<div class="absolute w-full h-full bg-black bg-opacity-50 z-40" />
	<div
		class="dark:bg-dark-bglight bg-dark-bglight dark:text-dark-text text-light-text w-1/3 p-10 rounded space-y-3 z-50"
	>
		<div class="flex justify-between items-center -mr-2 mb-6">
			<p class="text-2xl">Submission Results</p>
			<Icon size="large" button={true} on:click={close}><IoIosClose /></Icon>
		</div>
		{#each $result.results as result}
			<div class="flex flex-row items-center w-full">
				<p class="leading-5 flex-grow mr-1">{@html result.name}</p>
				<Checkbox value={result.passed} />
			</div>
			{#if !result.passed}
				<Error message={result.message} />
			{/if}
		{/each}
		{#if $result.results.every((res) => res.passed)}
			<div class="bg-green-900 bg-opacity-50 rounded p-3 text-green-500 mt-3">
				Congratulations! You have passed all of the requirements for this exercise.
			</div>
			<Button text="Next exercise" classes="bg-blue-700 w-32 float-right" on:click={nextExercise} />
		{:else}
			<div class="bg-red-900 bg-opacity-50 rounded p-3 text-red-500 mt-3">
				Not quite! You have passed {$result.passed}/{$result.total} requirements for this exercise.
			</div>
		{/if}
	</div>
</div>
