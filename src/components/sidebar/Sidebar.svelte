<script lang="ts">
	import Icon from '../common/Icon.svelte';
	import Bookmark from 'svelte-icons/io/IoMdBookmark.svelte';
	import { chapter as _chapter, exercise, project, result } from 'src/utils/exercise/exercise';
	import Checkbox from '../common/Checkbox.svelte';

	function updateChapter() {
		if ($result[$_chapter]) {
			console.log('Incrementing chapter');
			_chapter.update((chapter) => chapter + 1);
		}
	}

	$: $result && updateChapter();
</script>

<div class="bg-brand-background h-full overflow-y-auto">
	<div class="p-5 space-y-3">
		<p class="uppercase text-xs">{$project.name}</p>
		<h1 class="text-xl font-bold">{$exercise.name}</h1>
		<p>
			{@html $exercise.description}
		</p>
	</div>
	<div class="flex flex-row items-center px-5 py-3 space-x-5 bg-brand-accent">
		<Icon>
			<Bookmark />
		</Icon>
		<p>{$exercise.assessed ? 'Tasks' : 'Example'}</p>
	</div>
	<div class="p-5 space-y-3">
		{#each $exercise.chapters as chapter, index}
			{#if $exercise.assessed}
				<div
					class="transition-opacity flex items-center space-x-5 {index > $_chapter && 'opacity-40'}"
				>
					<Checkbox
						disabled={true}
						variant={index > $_chapter ? 'text' : 'default'}
						value={$result && (index < $_chapter || $_chapter == $exercise.chapters.length)
							? $result[index].passed
							: undefined}
					/>
					<p>{@html chapter.text}</p>
				</div>
			{:else}
				<p>{@html chapter.text}</p>
			{/if}
		{/each}
	</div>
</div>
