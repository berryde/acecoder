<script lang="ts">
	import Icon from '../common/Icon.svelte';
	import Bookmark from 'svelte-icons/io/IoMdBookmark.svelte';
	import { exercise, project } from 'src/utils/exercise/exercise';
</script>

<div class="bg-brand-background h-full overflow-y-auto">
	<div class="p-5 space-y-3">
		<p class="uppercase text-xs">{$project.name}</p>
		<h1 class="text-xl font-bold">{$exercise.name}</h1>
		<p>
			{$exercise.description}
		</p>
	</div>
	<div class="flex flex-row items-center px-5 py-3 space-x-5 bg-brand-accent">
		<Icon>
			<Bookmark />
		</Icon>
		<p>{$exercise.assessed ? 'Tasks' : 'Example'}</p>
	</div>
	<div class="p-5 space-y-3">
		{#each $exercise.chapters as chapter}
			<p>{@html chapter.text}</p>
		{/each}
	</div>
</div>
