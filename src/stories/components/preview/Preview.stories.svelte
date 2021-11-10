<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Preview from '../../../components/preview/Preview.svelte';
</script>

<Meta
	title="Preview/Preview"
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
			public: {
				'public/index.html':
					'<div class="flex justify-center items-center text-white rounded h-10 bg-blue-500 p-5"><p>Hello, world!</p></div>'
			},
			js: '',
			css: ''
		}
	}}
/>

<Story
	name="Static HTML routing"
	args={{
		compiled: {
			public: {
				'public/index.html':
					'<div class="flex flex-col justify-center items-center text-white rounded h-10 bg-green-500 p-5"><p>Page 1</p></div><div><a href="page2.html" class="text-green-500 flex justify-center">Click me</a></div>',
				'public/page2.html':
					'<div class="flex flex-col justify-center items-center text-white rounded h-10 bg-red-500 p-5"><p>Page 2</p></div><div><a href="index.html" class="text-red-500 flex justify-center">Go back</a></div>'
			},
			js: '',
			css: ''
		}
	}}
/>

<Story
	name="React"
	args={{
		compiled: {
			public: {
				'public/index.html': `<html>
 <head>
 </head>
 <body>
    <div id="root"></div>
  </body>    
</html>`
			},
			js: `import React, { StrictMode } from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';

function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("h1", null, "\uD83C\uDF0D Hello, world!"));
}

const rootElement = document.getElementById("root");
ReactDOM.render( /*#__PURE__*/React.createElement(StrictMode, null, /*#__PURE__*/React.createElement(App, null)), rootElement);`,
			css: ''
		}
	}}
/>
