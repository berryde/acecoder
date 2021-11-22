<script lang="ts">
	import SplitPane from '../../components/splitpane/SplitPane.svelte';
	import { darkMode } from '../../utils/settings/settings';
	import Sidebar from '../../components/sidebar/Sidebar.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import Explorer from '../../components/explorer/Explorer.svelte';
	import Feedback from '../../components/feedback/Feedback.svelte';
	import Settings from '../../components/settings/Settings.svelte';
	import { onMount } from 'svelte';
	import type { SidebarTab } from 'src/utils/types';
	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import IoMdText from 'svelte-icons/io/IoMdText.svelte';
	import Profile from '../../components/profile/Profile.svelte';
	import ProfileImage from '../../components/profile/ProfileImage.svelte';
	import SidebarItem from '../../components/sidebar/SidebarItem.svelte';

	/**
	 * Whether the user is currently drawing a selection over the editor.
	 * This allows us to ignore pointer events in the preview iframe.
	 */
	let selecting = false;

	/**
	 * The selected sidebar item's index.
	 */
	let selected = 1;

	/**
	 * Whether the sidebar is collapsed.
	 */
	let collapsed = false;

	/**
	 * The size of the left pane before the sidebar is collapsed.
	 */
	let prevL: number;

	/**
	 * The size of the right pane before the sidebar is collapsed.
	 */
	let prevR: number;

	/**
	 * The size of the left pane.
	 */
	let L = 13;

	/**
	 * The size of the right pane.
	 */
	let R = 87;

	/**
	 * The tabs to display in the sidebar.
	 */
	const sidebarTabs: SidebarTab[] = [
		{
			name: 'profile',
			icon: ProfileImage,
			component: Profile
		},
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

	/**
	 * Update the selected index and collapsed state of the sidebar.
	 * @param updatedIndex The newly selected sidebar item index.
	 */
	function updateSidebar(updatedIndex: number | undefined) {
		selected = updatedIndex;
		if (collapsed) {
			openSidebar();
		}
	}

	/**
	 * Update the value of whether the user is currently drawing a selection over the editor.
	 * @param e The triggering event.
	 */
	function toggleSelecting(e: CustomEvent<boolean>) {
		selecting = e.detail;
	}

	/**
	 * Called when the user presses a key while using the application
	 * @param e The event that triggered this function.
	 */
	function keydown(e: KeyboardEvent) {
		if (e.code == 'KeyB' && e.ctrlKey) {
			e.preventDefault();
			collapsed ? openSidebar() : collapseSidebar();
		}
	}

	/**
	 * Collapse the sidebar so that it is not visible.
	 */
	function collapseSidebar() {
		prevL = L;
		prevR = R;

		collapsed = true;

		L = 0;
		R = 100;
	}

	/**
	 * Make the sidebar visible.
	 */
	function openSidebar(left: number = prevL, right: number = prevR) {
		collapsed = false;
		L = left;
		R = right;
	}

	// Add a listener for key combinations
	onMount(() => {
		window.addEventListener('keydown', keydown);
	});
</script>

<div
	class="h-screen {$darkMode &&
		'dark'} text-light-text dark:text-dark-text dark:bg-dark-bglight flex flex-row"
>
	<Sidebar
		on:collapse={() => collapseSidebar()}
		on:select={(e) => updateSidebar(e.detail)}
		{collapsed}
		{selected}
		tabs={sidebarTabs}
	/>
	<SplitPane
		isHorizontal={true}
		minPane1Size={collapsed ? '0' : undefined}
		bind:pane1Size={L}
		bind:pane2Size={R}
		on:resize={() => collapsed && openSidebar(0, 100)}
	>
		<div slot="pane1" class="bg-dark-bgdark">
			{#if !collapsed}
				<SidebarItem title={sidebarTabs[selected].name}>
					<svelte:component this={sidebarTabs[selected].component} />
				</SidebarItem>
			{/if}
		</div>
		<div slot="pane2">
			<SplitPane isHorizontal={true} let:resizing={resizingX}>
				<div slot="pane1">
					<EditorContainer on:drag={toggleSelecting} />
				</div>
				<div slot="pane2">
					<PreviewContainer {resizingX} {selecting} />
				</div>
			</SplitPane>
		</div>
	</SplitPane>
</div>
