<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Editor from '../../../components/editor/Editor.svelte';
</script>

<Meta
	title="Editor/Text editor"
	component={Editor}
	argTypes={{
		initialValue: { control: 'text' },
		language: {
			control: { type: 'select' },
			options: ['jsx', 'html', 'css']
		}
	}}
/>

<Template let:args>
	<Editor {...args} />
</Template>

<Story
	name="JSX"
	args={{
		initialValue: `export const test = () => {
  console.log("Hello, world!")
}`,
		language: 'jsx'
	}}
/>

<Story
	name="HTML"
	args={{
		initialValue: `<div>
  <p>Hello, world!</p>
</div>`,
		language: 'html'
	}}
/>

<Story
	name="CSS"
	args={{
		initialValue: `.some-class {
  background-color: 'red';
}`,
		language: 'css'
	}}
/>
