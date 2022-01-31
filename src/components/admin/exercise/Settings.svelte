<script lang="ts">
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Input from 'src/components/common/Input.svelte';
	import type { Exercise } from 'src/utils/types';
	import { createEventDispatcher } from 'svelte';

	export let exercise: Exercise;
	export let editing: boolean;
	let inherits = !!exercise.previous;

	// function updatePrevious() {
	// 	try {
	// 		exercise.previous = previous
	// 			.split(',')
	// 			.filter((s) => /[0-9]/.test(s))
	// 			.map((s) => parseInt(s));
	// 	} catch (err) {
	// 		console.error('Invalid input for previous exercises. This should be a comma separated list.');
	// 	}
	// }

	const dispatch = createEventDispatcher();

	function toggleEdit() {
		dispatch('edit');
	}
</script>

<div class="space-y-2">
	<div class="flex flex-row justify-between items-center">
		<p class="text-xl font-bold">Settings</p>
		{#if !editing}
			<p class="text-brand-primary cursor-pointer" on:click={toggleEdit}>Edit</p>
		{/if}
	</div>
	<div class="space-y-2">
		<div>
			<p class="font-bold">Name</p>
			{#if editing}
				<Input variant="dark" bind:value={exercise.name} />
			{:else}
				<p>{exercise.name}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Evaluation</p>
			<div class="flex flex-row items-center space-x-3">
				<p>This exercise is assessed</p>
				<Checkbox
					bind:value={exercise.assessed}
					variant="true-false"
					disabled={!editing}
					on:click={() => {
						dispatch('toggleAssessed');
					}}
				/>
			</div>
		</div>
		<div>
			<p class="font-bold">Description</p>
			{#if editing}
				<textarea
					class="bg-brand-background rounded p-2 w-full h-28"
					name="introduction"
					bind:value={exercise.description}
				/>
			{:else}
				<p>{@html exercise.description}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Previous exercise</p>
			<div class="flex flex-row items-center space-x-3">
				<p>This exercise inherits from a previous exercise</p>
				<Checkbox
					bind:value={inherits}
					variant="true-false"
					disabled={!editing}
					on:click={() => (inherits = !inherits)}
				/>
			</div>
		</div>
		{#if inherits}
			<div>
				<p class="font-bold">Previous exercise index</p>
				{#if editing}
					<Input variant="dark" bind:value={exercise.previous} />
				{:else}
					<p>{exercise.previous}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
