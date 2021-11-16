<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Folder from '../../../components/explorer/Folder.svelte';
</script>

<Meta
	title="Explorer/Folder"
	component={Folder}
	argTypes={{
		path: { control: 'text' },
		depth: { control: 'number' },
		children: { control: 'object' }
	}}
/>

<Template let:args>
	<div style="max-width: 20rem;"><Folder {...args} /></div>
</Template>

<Story
	name="Default"
	args={{
		path: `src`,
		children: {},
		depth: 0
	}}
/>

<Story
	name="With children"
	args={{
		path: `src`,
		children: {
			test: {
				type: 'folder',
				children: {
					'index.tsx': {
						type: 'file',
						value: ''
					}
				}
			},
			'package.json': {
				type: 'file',
				value: ''
			}
		},
		depth: 0
	}}
/>
