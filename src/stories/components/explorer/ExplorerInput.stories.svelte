<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import ExplorerInput from '../../../components/explorer/ExplorerInput.svelte';
</script>

<Meta
	title="Explorer/Input"
	component={ExplorerInput}
	argTypes={{
		reservedNames: { control: 'object' },
		depth: { control: 'number' },
		initialValue: { control: 'text' }
	}}
/>

<Template let:args>
	<div style="max-width: 20rem;"><ExplorerInput {...args} /></div>
</Template>

<Story
	name="Default"
	args={{
		reservedNames: [],
		depth: 0,
		initialValue: ''
	}}
/>
