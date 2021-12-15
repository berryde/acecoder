<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Button from 'src/components/common/Button.svelte';
</script>

<Meta
	title="Common/Button"
	component={Button}
	argTypes={{
		text: { control: 'text' },
		loading: { control: 'boolean' },
		disabled: { control: 'boolean' }
	}}
/>

<Template let:args>
	<Button {...args} />
</Template>

<Story
	name="Default"
	args={{
		text: `Submit`,
		loading: false,
		disabled: false,
		classes: 'bg-blue-500 px-5 text-white'
	}}
/>

<Story
	name="Disabled"
	args={{
		text: `Disabled`,
		loading: false,
		disabled: true,
		classes: 'bg-dark-bgdark px-5 text-white bg-opacity-50'
	}}
/>

<Story
	name="Loading"
	args={{
		text: `Submit`,
		loading: true,
		disabled: false,
		classes: 'bg-blue-500 px-5 text-white'
	}}
/>
