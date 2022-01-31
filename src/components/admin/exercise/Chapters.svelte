<script lang="ts">
	import type { Exercise } from 'src/utils/types';
	import Button from '../../common/Button.svelte';
	import Input from '../../common/Input.svelte';

	export let editing: boolean;
	export let exercise: Exercise;

	function deleteChapter(index: number) {
		exercise.chapters.splice(index, 1);
		exercise = exercise;
	}

	function addChapter() {
		if (exercise.assessed) {
			exercise.chapters.push({
				spec: '',
				text: ''
			});
		} else {
			exercise.chapters.push({
				text: ''
			});
		}
		exercise = exercise;
	}
</script>

<div class="space-y-2">
	<p class="text-xl font-bold">Chapters</p>
	<p>
		Chapters are individual components of an exercise. A chapter can be some text to accompany an
		example, or a task that the user should complete if the exercise is assessed.
	</p>
	<div class="space-y-3">
		{#each exercise.chapters as chapter, index}
			<div class="bg-brand-background p-5 space-y-3 rounded">
				<div>
					<p class="font-bold">Text</p>
					{#if editing}
						<textarea class="bg-brand-accent p-2 w-full rounded h-40" bind:value={chapter.text} />
					{:else}
						<p>{@html chapter.text}</p>
					{/if}
				</div>

				{#if exercise.assessed}
					<div>
						<p>Test spec name</p>
						<p class="text-xs">The name of the specific test case within the test file.</p>
						<Input bind:value={chapter.spec} />
					</div>
				{/if}
				{#if editing}
					<div class="flex justify-end w-full">
						<p class="text-brand-danger-light cursor-pointer" on:click={() => deleteChapter(index)}>
							Delete
						</p>
					</div>
				{/if}
			</div>
		{/each}

		{#if editing}
			<Button variant="dark" text="Add chapter" on:click={() => addChapter()} />
		{/if}
	</div>
</div>
