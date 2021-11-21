<script>
	import SidebarItem from '../sidebar/SidebarItem.svelte';
</script>

<SidebarItem title="feedback">
	<div class="px-3 h-full">
		<p class="leading-5">Submit anonymous feedback about the application to help improve it.</p>
		<p class="mt-3 uppercase text-xs">Component</p>
		<select
			class="w-full dark:bg-dark-bglight px-2 h-8 focus:outline-none focus:ring-1 focus:ring-bluegray-300"
		>
			<option>File explorer</option>
			<option>Text editor</option>
			<option>Settings</option>
			<option>Live preview</option>
			<option>Console</option>
			<option>Other</option>
		</select>
		<p class="mt-3 uppercase text-xs">Comment</p>
		<textarea
			class="w-full dark:bg-dark-bglight focus:outline-none focus:ring-1 focus:ring-bluegray-300 px-3 py-1 h-1/3 resize-none"
			spellcheck={true}
		/>
		<button class="transition-all hover:bg-blue-800 bg-blue-500 px-3 mt-3 rounded py-1 text-white "
			>Submit</button
		>
	</div>
</SidebarItem>
