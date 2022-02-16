<script lang="ts">
	import Icon from '../common/Icon.svelte';
	import Bookmark from 'svelte-icons/io/IoMdBookmark.svelte';
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
	import { contents, format } from 'src/utils/editor/editor';
	import { getExtension } from 'src/utils/filesystem/filesystem';
	import { selectedTab } from 'src/utils/tabs/tabs';
	import { page } from '$app/stores';

	function updateChapter() {
		submissionAttempt += 1;
		if (
			$_chapter < $exercise.chapters.length &&
			$_chapter in $result &&
			$result[$_chapter].passed
		) {
			_chapter.update((c) => c + 1);
			submissionAttempt = 0;
		}
	}

	let submissionAttempt = 0;
	$: $result && updateChapter();

	onMount(() => {
		if ($result && $result !== {}) {
			// Get index of the most recently passed chapter
			const index = Math.max(
				...Object.entries($result)
					.filter((entry) => entry[1].passed)
					.map((entry) => parseInt(entry[0]))
			);
			_chapter.set(index + 1);
			submissionAttempt = 0;
		}
	});

	function handleFormat() {
		const formatted = format($contents, getExtension($selectedTab));
		contents.set(formatted);
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
		<Icon
			label="Reset"
			button={true}
			card={true}
			on:click={() => reset($page.params.projectID, $page.params.index)}
			aria="reset exercise"
		>
			<Refresh />
		</Icon>
		<Icon label="Format" button={true} card={true} aria="format code" on:click={handleFormat}>
			<Wand />
		</Icon>
	</div>
	<div class="flex flex-row items-center px-5 py-3 space-x-5 bg-brand-accent">
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
	<div class="space-y-3">
		{#each $exercise.chapters as chapter, index}
			{#if $exercise.assessed}
				<div
					class="transition-opacity p-3 flex items-center space-x-5 {index > $_chapter &&
						'opacity-40'}"
				>
					<Checkbox
						disabled={true}
						variant={index > $_chapter ? 'text' : 'default'}
						value={$result && $result[index] ? $result[index].passed : undefined}
					/>
					<p class="chapter">{@html chapter.text}</p>
				</div>
				{#if $result && $result[index] && !$result[index].passed && chapter.hint && index == $_chapter && submissionAttempt > 0}
					<div class="bg-brand-danger-dark bg-opacity-50 p-5 text-brand-danger-light">
						<p class="hint">{@html chapter.hint}</p>
					</div>
				{/if}
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
