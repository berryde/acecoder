<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Tabs from '../../../components/tabs/Tabs.svelte';
</script>

<Meta
	title="Tabs/Tabs"
	component={Tabs}
	argTypes={{
		tabs: { control: 'object', description: 'The filenames of open editors.', defaultValue: [] },
		selected: { control: 'text', description: "The selected editor's filename.", defaultValue: '' },
		unsaved: {
			control: 'object',
			description: 'The filenames of any unsaved files.',
			defaultValue: []
		}
	}}
/>

<Template let:args>
	<Tabs {...args} />
</Template>

<Story
	name="Default"
	args={{
		tabs: ['index.tsx', 'package.json'],
		selected: '',
		unsaved: []
	}}
/>

<Story
	name="Selected"
	args={{
		tabs: ['index.tsx', 'package.json'],
		selected: 'index.tsx',
		unsaved: []
	}}
/>

<Story
	name="Unsaved"
	args={{
		tabs: ['index.tsx', 'package.json'],
		selected: 'index.tsx',
		unsaved: ['index.tsx']
	}}
/>
