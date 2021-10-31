<script lang="ts">
	import type { WorkerResponse } from 'src/utils/types';

	export let compiled: WorkerResponse;

	const style = 'style';
	$: srcdoc = `
<!doctype html>
<html>
	<head>
		<${style}>
			html {
				overflow: hidden;
				height: 100%;
			}
			body {
				margin: 0;
				height: 100%;
				width: 100%;
			}
			#root {
				height: 100%;
			}
			${compiled ? compiled.css : ''}
		</${style}>
	</head>
	<body>
        <div id="root"></div>
		<script type="module">
			${compiled ? compiled.js : ''}
		<\/script>    
    </body>
</html>
    `;
</script>

<iframe title="Preview" class="h-full bg-white" {srcdoc} />
