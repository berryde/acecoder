<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Sidebar from '../../../components/sidebar/Sidebar.svelte';
	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import IoMdText from 'svelte-icons/io/IoMdText.svelte';
	import Explorer from 'src/components/explorer/Explorer.svelte';
	import Feedback from 'src/components/feedback/Feedback.svelte';
	import Settings from 'src/components/settings/Settings.svelte';
	import type { SidebarTab } from '../../../utils/types';

	/**
	 * The tabs to display in the sidebar.
	 */
	const sidebarTabs: SidebarTab[] = [
		{
			name: 'explorer',
			icon: IoIosFiling,
			component: Explorer
		},
		{
			name: 'feedback',
			icon: IoMdText,
			component: Feedback
		},
		{
			name: 'settings',
			icon: IoIosSettings,
			component: Settings
		}
	];
</script>

<Meta title="Sidebar/Sidebar" component={Sidebar} />

<Template>
	<div class="w-64">
		<Sidebar tabs={sidebarTabs} selected={0} collapsed={false} />
	</div>
</Template>

<Story name="Default" args={{}} />
