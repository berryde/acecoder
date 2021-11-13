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
		language: 'jsx',
		selected: true
	}}
/>

<Story
	name="HTML"
	args={{
		initialValue: `<div>
  <p>Hello, world!</p>
</div>`,
		language: 'html',
		selected: true
	}}
/>

<Story
	name="CSS"
	args={{
		initialValue: `.some-class {
  background-color: 'red';
}`,
		language: 'css',
		selected: true
	}}
/>

<Story
	name="Long line"
	args={{
		initialValue: `console.log("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut arcu ante. Vivamus lacus urna, scelerisque eu dictum in, condimentum id dui. Cras sodales gravida nulla, vitae vulputate mauris laoreet ut. Aenean venenatis pulvinar ultrices. Vestibulum efficitur venenatis volutpat."`,
		language: 'jsx',
		selected: true
	}}
/>
