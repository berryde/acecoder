<script lang="ts">
	import { formatOnSave, reloadOnSave } from '../../utils/settings/settings';

	import SidebarItem from '../common/SidebarItem.svelte';

	function toggleFormatOnSave() {
		formatOnSave.update((fos) => !fos);
	}

	function toggleReloadOnSave() {
		reloadOnSave.update((ros) => !ros);
	}
</script>

<SidebarItem title="settings">
	<div class="flex flex-col px-3">
		<p class="uppercase text-xs">Editor</p>
		<div class="flex flex-row justify-between items-center">
			<p>Format on save</p>
			<input type="checkbox" checked={$formatOnSave} on:click={toggleFormatOnSave} />
		</div>
		<p class="uppercase text-xs mt-4">Preview</p>
		<p class="uppercase text-xs mt-4">Misc</p>
	</div>
</SidebarItem>
