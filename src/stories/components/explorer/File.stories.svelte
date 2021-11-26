<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import File from 'src/components/explorer/File.svelte';
</script>

<Meta
	title="Explorer/File"
	component={File}
	argTypes={{
		path: { control: 'text' },
		depth: { control: 'number' }
	}}
/>

<Template let:args>
	<div style="max-width: 20rem;"><File {...args} /></div>
</Template>

<Story
	name="Default"
	args={{
		path: `src/index.tsx`,
		depth: 0
	}}
/>
