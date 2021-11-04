<script lang="ts">
	import type { WorkerResponse } from 'src/utils/types';

	export let compiled: WorkerResponse;

	const style = 'style';
	$: srcdoc = compiled ? build() : '';

	function build(): string {
		let html = compiled.html;
		// Include a body tag if missing.
		if (!html.match(/\<body\>[\s\S]*\<\/body\>/)) {
			html = '<body>' + html + '</body>';
		}
		// Wrap the HTML with a HTML tag if missing.
		if (!html.match(/\<html\>[\s\S]*\<\/html\>/)) {
			html = '<html>' + html + '</html>';
		}
		// Include a head tag if missing.
		if (!html.match(/\<head\>[\s\S]*\<\/head\>/)) {
			const split = html.split('<html>');
			html = split[0] + '<html><head></head>' + split[1];
		}
		// Inject the JS.
		if (compiled.js) {
			const split = html.split('<body>');
			html = split[0] + "<body><script type='module'>" + compiled.js + '</' + 'script>' + split[1];
		}
		// Inject the CSS.
		if (compiled.css) {
			const split = html.split('<head>');
			html = split[0] + '<head><style>' + compiled.css + '</' + 'style>' + split[1];
		}
		return html;
	}
</script>

<iframe title="Preview" class="h-full bg-white" {srcdoc} />
