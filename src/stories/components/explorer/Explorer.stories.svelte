<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Explorer from '../../../components/explorer/Explorer.svelte';
</script>

<Meta title="Explorer/Explorer" component={Explorer} />

<Template>
	<div style="max-width: 20rem;"><Explorer /></div>
</Template>

<Story name="Default" />
