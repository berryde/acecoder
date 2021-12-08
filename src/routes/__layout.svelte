<script>
	import '../app.css';
	import { darkMode } from 'src/utils/settings/settings';
</script>

<div class={$darkMode && 'dark'}>
	<slot />
</div>
