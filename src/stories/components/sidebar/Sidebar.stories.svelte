<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Sidebar from '../../../components/sidebar/Sidebar.svelte';
</script>

<Meta title="Sidebar/Sidebar" component={Sidebar} />

<Template let:args>
	<div class="w-64">
		<Sidebar />
	</div>
</Template>

<Story name="Default" args={{}} />
