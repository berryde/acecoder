<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Explorer from '../../../components/explorer/Explorer.svelte';
</script>

<Meta
	title="Explorer/Explorer"
	component={Explorer}
	argTypes={{
		files: { control: 'object' }
	}}
/>

<Template let:args>
	<div style="max-width: 20rem;"><Explorer {...args} /></div>
</Template>

<Story
	name="Default"
	args={{
		files: {
			src: {
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
		}
	}}
/>
