<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// Props
	export let reservedNames: string[] = [];
	export let depth: number = 0;
	export let initialValue: string = '';

	// Variables
	/**
	 * The value bound to the input field.
	 */
	let value: string;
	/**
	 * A reference to the HTML input field.
	 */
	let input: HTMLInputElement;
	/**
	 * Whether there is an error with the user's input.
	 */
	let error: boolean = false;
	/**
	 * The error message to show, if any.
	 */
	let errorMessage: string;

	/**
	 * Event dispatcher to send custom events.
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Called when the input is updated.
	 * @param key The most recently entered key.
	 */
	function handleFilenameChanged(key: string) {
		const submission = value + key;
		if (key === 'Escape') {
			dispatch('cancelled');
		} else if (key === 'Enter') {
			if (!error) {
				if (value == initialValue) {
					dispatch('cancelled');
				} else {
					dispatch('submit', value);
				}
			}
		} else {
			if (submission != initialValue && reservedNames.includes(submission)) {
				error = true;
				errorMessage = `A file/folder called '${value + key}' already exists in this directory.`;
			} else {
				error = false;
			}
		}
	}

	// Focus the input by default.
	onMount(() => {
		input.focus();
		value = initialValue;
	});
</script>

<div class={error ? 'bg-red-800' : 'bg-bluegray-default'} style="padding-left: {depth * 0.5}rem;">
	<div
		class="flex flex-row items-center text-bluegray-light pl-2 {error
			? ' ring-inset ring-red-800 ring-2'
			: ''}"
	>
		<slot />
		<input
			class="focus:outline-none bg-transparent ring-inset pl-2 w-full h-8"
			bind:value
			bind:this={input}
			on:focusout={() => dispatch('cancelled')}
			on:keydown={(e) => handleFilenameChanged(e.key)}
			on:submit={(e) => e.preventDefault()}
		/>
	</div>
	{#if error}
		<div class="p-2">
			<p>{errorMessage}</p>
		</div>
	{/if}
</div>
