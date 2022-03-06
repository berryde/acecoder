<script lang="ts">
	import Icon from '../common/Icon.svelte';
	import Bookmark from 'svelte-icons/io/IoMdBookmark.svelte';
	import Save from 'svelte-icons/io/IoIosSave.svelte';
	import Book from 'svelte-icons/io/IoIosJournal.svelte';
	import {
		chapter as _chapter,
		exercise,
		project,
		reset,
		result
	} from 'src/utils/exercise/exercise';
	import Checkbox from '../common/Checkbox.svelte';
	import Refresh from 'svelte-icons/io/IoMdRefresh.svelte';
	import Wand from 'svelte-icons/io/IoIosColorWand.svelte';
	import { onMount } from 'svelte';
	import Explorer from '../explorer/Explorer.svelte';
	import { format, save, toastMessage, reset as _reset } from 'src/utils/editor/editor';
	import { page } from '$app/stores';
	import type { ExerciseResults } from '~shared/types';

	onMount(() => {
		if ($result && Object.keys($result).length !== 0) {
			// Get index of the most recently passed chapter
			let index = Math.max(...Object.entries($result).map((entry) => parseInt(entry[0])));
			if ($result[index].passed) index += 1;
			_chapter.set(index);
		}
	});

	/**
	 * Format the editor contents when the format button is clicked
	 */
	function handleFormat() {
		format.update((format) => format + 1);
	}

	function handleSave() {
		save.update((save) => save + 1);
	}

	/**
	 * Reset the exercise when the reset button is clicked
	 */
	async function handleReset() {
		await reset($page.params.projectID, $page.params.index);
		_reset.update((reset) => reset + 1);
		toastMessage.set({
			message: 'Exercise reset',
			variant: 'info'
		});
	}

	/**
	 * Get the result for a given chapter if it exists
	 *
	 * @param result The result object
	 * @param chapter The current chapter
	 */
	function getResult(result: ExerciseResults, chapter: number): boolean | undefined {
		if (result && chapter in result) {
			return result[chapter].passed;
		}
		return undefined;
	}
</script>

<div class="bg-brand-background h-full overflow-y-auto sidebar overflow-x-hidden">
	<div class="p-5 space-y-3">
		<p class="uppercase text-xs">{$project.name}</p>
		<h1 class="text-xl font-bold">{$exercise.name}</h1>
		<p id="description">
			{@html $exercise.description}
		</p>
	</div>
	<div class="flex flex-row px-5 py-3 mr-3 pt-0 space-x-3 items-center h-10 justify-end">
		<Icon label="Save" button={true} card={true} on:click={handleSave} aria="save changes">
			<Save />
		</Icon>
		<Icon label="Reset" button={true} card={true} on:click={handleReset} aria="reset exercise">
			<Refresh />
		</Icon>
		<Icon label="Format" button={true} card={true} aria="format code" on:click={handleFormat}>
			<Wand />
		</Icon>
	</div>
	<div class="flex flex-row items-center px-3 py-3 space-x-5 bg-brand-accent">
		{#if $exercise.assessed}
			<Icon>
				<Bookmark />
			</Icon>
			<p>Tasks</p>
		{:else}
			<Icon>
				<Book />
			</Icon>
			<p>Notes</p>
		{/if}
	</div>
	<div>
		{#each $exercise.chapters as chapter, index}
			{#if $exercise.assessed}
				<div
					class="transition-opacity px-5 py-3 flex items-center space-x-5 {index > $_chapter &&
						'opacity-40'}"
				>
					<Checkbox disabled={true} variant={'true-false'} value={getResult($result, index)} />
					<p class="chapter">{@html chapter.text}</p>
				</div>
				{#if getResult($result, index) === false}
					<div class="bg-brand-danger-dark bg-opacity-50 p-5 text-brand-danger-light">
						<p class="hint">{@html chapter.hint}</p>
					</div>
				{/if}
				<hr class="border-brand-accent" />
			{:else}
				<div class="p-5">
					<p class="chapter">{@html chapter.text}</p>
				</div>
			{/if}
		{/each}
	</div>
	<Explorer />
</div>

<style lang="postcss">
	:global(#description a) {
		@apply text-brand-primary underline;
	}
	:global(.chapter a) {
		@apply text-brand-primary underline;
	}
	:global(.hint a) {
		@apply underline;
	}
	:global(.sidebar code) {
		@apply px-1 py-0.5 text-yellow-400 bg-brand-editor-background rounded;
	}
</style>
