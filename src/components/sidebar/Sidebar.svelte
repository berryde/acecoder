<script lang="ts">
	import Icon from '../common/Icon.svelte';
	import Bookmark from 'svelte-icons/io/IoMdBookmark.svelte';
</script>

<div class="bg-brand-background h-full overflow-y-auto">
	<div class="p-5 space-y-3">
		<p class="uppercase text-xs">Project name</p>
		<h1 class="text-xl font-bold">Exercise title</h1>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate tempora laudantium esse
			nihil optio, unde adipisci ducimus dolorem. Asperiores officia illum harum quam amet
			perferendis blanditiis aliquid necessitatibus quos natus!
		</p>
	</div>
	<div class="flex flex-row items-center px-5 py-3 space-x-5 bg-brand-accent">
		<Icon>
			<Bookmark />
		</Icon>
		<p>Example</p>
	</div>
	<div class="p-5 space-y-3">
		<p>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta doloribus odit rem dolorem
			tempora cumque corrupti velit dolorum ab asperiores laudantium, reiciendis modi. Rem
			necessitatibus in obcaecati, esse nesciunt minus.
		</p>
		<p>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta doloribus odit rem dolorem
			tempora cumque corrupti velit dolorum ab asperiores laudantium, reiciendis modi. Rem
			necessitatibus in obcaecati, esse nesciunt minus.
		</p>
		<p>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta doloribus odit rem dolorem
			tempora cumque corrupti velit dolorum ab asperiores laudantium, reiciendis modi. Rem
			necessitatibus in obcaecati, esse nesciunt minus.
		</p>
	</div>
</div>
