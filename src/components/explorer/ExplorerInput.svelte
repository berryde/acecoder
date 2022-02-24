<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	/**
	 * Reserved filenames which cannot be created
	 */
	export let reservedNames: string[] = [];

	/**
	 * The depth of this input in the filesystem
	 */
	export let depth: number = 0;

	/**
	 * The initial value of the input
	 */
	export let initialValue: string = '';

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
		if (key === 'Escape') {
			dispatch('cancelled');
		} else if (key === 'Enter' && !error) {
			if (value == initialValue) {
				dispatch('cancelled');
			} else {
				dispatch('submit', value);
			}
		}
	}

	/**
	 * Called when value is changed. Determines whether the requested value is valid.
	 */
	$: if (value != initialValue && reservedNames.includes(value)) {
		error = true;
		errorMessage = `A file/folder called '${value}' already exists in this directory.`;
	} else {
		error = false;
	}

	// Focus the input by default.
	onMount(() => {
		input.focus();
		if (initialValue != undefined) {
			value = initialValue;
		}
	});
</script>

<div class={error ? 'bg-red-800' : 'bg-bluegray-default'} style="padding-left: {depth * 0.5}rem;">
	<div
		class="flex flex-row items-center text-bluegray-light pl-3 {error
			? ' ring-inset ring-red-800 ring-2'
			: ''}"
	>
		<slot />
		<input
			class="focus:outline-none bg-transparent ring-inset pl-2 w-full h-8"
			data-testid="explorer-input"
			aria-label="rename file"
			bind:value
			bind:this={input}
			on:focusout={() => dispatch('cancelled')}
			on:keydown={(e) => handleFilenameChanged(e.key)}
		/>
	</div>
	{#if error}
		<div class="p-2">
			<p>{errorMessage}</p>
		</div>
	{/if}
</div>
