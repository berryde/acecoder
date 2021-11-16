<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Settings from '../../../components/settings/Settings.svelte';
</script>

<Meta title="Settings/Settings" component={Settings} />

<Template let:args>
	<div class="w-48">
		<Settings />
	</div>
</Template>

<Story name="Default" args={{}} />
