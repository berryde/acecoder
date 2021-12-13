<script lang="ts">
	import {
		toggleFormatOnSave,
		toggleDarkMode,
		darkMode,
		formatOnSave
	} from '../../utils/settings/settings';
</script>

<div class="flex flex-col px-3">
	<p class="uppercase text-xs">Editor</p>
	<div class="flex flex-row justify-between items-center">
		<p>Format on save</p>
		<input
			data-testid="toggle-format"
			type="checkbox"
			checked={$formatOnSave}
			on:click={toggleFormatOnSave}
		/>
	</div>
	<p class="uppercase text-xs mt-4">Preview</p>
	<p class="uppercase text-xs mt-4">Misc</p>
	<div class="flex flex-row justify-between items-center">
		<p>Use dark theme</p>
		<input
			data-testid="toggle-dark"
			type="checkbox"
			checked={$darkMode}
			on:click={toggleDarkMode}
		/>
	</div>
</div>
