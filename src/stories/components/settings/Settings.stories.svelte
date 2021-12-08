<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Settings from 'src/components/settings/Settings.svelte';
</script>

<Meta title="Settings/Settings" component={Settings} />

<Template>
	<div class="w-48">
		<Settings />
	</div>
</Template>

<Story name="Default" args={{}} />
