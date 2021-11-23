<script>
	import Button from '../auth/Button.svelte';
</script>

<div class="px-3 h-full">
	<p class="leading-5">Submit anonymous feedback about the application to help improve it.</p>
	<p class="mt-3 uppercase text-xs mb-1">Component</p>
	<select
		class="w-full bg-light-bglight dark:bg-dark-bglight px-2 h-8 focus:outline-none focus:ring-1 focus:ring-bluegray-300"
	>
		<option>File explorer</option>
		<option>Text editor</option>
		<option>Settings</option>
		<option>Live preview</option>
		<option>Console</option>
		<option>Other</option>
	</select>
	<p class="mt-3 uppercase text-xs mb-1">Comment</p>
	<textarea
		class="w-full dark:bg-dark-bglight focus:outline-none focus:ring-1 focus:ring-bluegray-300 px-3 py-1 h-1/3 resize-none"
		spellcheck={true}
	/>
	<Button
		text="Submit"
		classes="bg-light-bglight text-light-text hover:bg-opacity-50 dark:bg-dark-bglight dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-2"
	/>
</div>
