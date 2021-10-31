<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Preview from '../../../components/preview/Preview.svelte';
</script>

<Meta
	title="Editor/Preview"
	component={Preview}
	argTypes={{
		compiled: {
			js: { control: 'text' },
			css: { control: 'text' }
		}
	}}
/>

<Template let:args>
	<Preview {...args} />
</Template>

<Story
	name="Example"
	args={{
		compiled: {
			js: '',
			css: ''
		}
	}}
/>
