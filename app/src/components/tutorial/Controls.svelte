<script lang="ts">
	import Save from 'svelte-icons/io/IoIosSave.svelte';
	import Refresh from 'svelte-icons/io/IoMdRefresh.svelte';
	import Wand from 'svelte-icons/io/IoIosColorWand.svelte';
	import Icon from '../common/Icon.svelte';
	import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';
</script>

<p class="text-lg mb-2">Using the editor</p>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<Save />
	</Icon>
	<p class="flex-grow">
		The <strong>save</strong> button can be used an any time to save your work, or you can use the
		<code>CTRL+S</code> shortcut.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<Refresh />
	</Icon>
	<p class="flex-grow">
		Made a mistake? The <strong>reset</strong> button can be used to reset current exercise.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<Wand />
	</Icon>
	<p class="flex-grow">
		The <strong>format</strong> button can be used to automatically indent and tidy up your code
		using Prettier. You can also use the <code>CTRL+Alt+L</code> shortcut.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<IoIosPlay />
	</Icon>
	<p class="flex-grow">
		The <strong>run</strong> button can be used to update the live preview.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<IoIosExpand />
	</Icon>
	<p class="flex-grow">
		The <strong>popout</strong> button lets you open the live preview in a new window.
	</p>
</div>

<style lang="postcss">
	code {
		@apply bg-brand-background px-2 py-1 text-yellow-400 rounded;
	}
</style>
