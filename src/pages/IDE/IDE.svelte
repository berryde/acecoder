<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import { onMount } from 'svelte';
	import type { SidebarTab } from 'src/utils/types';
	import SidebarItem from 'src/components/sidebar/SidebarItem.svelte';
	import Admin from 'src/components/admin/Admin.svelte';
	import IoIosBuild from 'svelte-icons/io/IoIosBuild.svelte';
	import { auth } from 'src/utils/auth/auth';
	import { loadExercise, loadStandalone, standalone } from 'src/utils/exercise/exercise';
	import { selectedTab } from 'src/utils/tabs/tabs';
	import { save } from 'src/utils/codemirror/codemirror';

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
	export let sidebarTabs: SidebarTab[];

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

	function handleSave() {
		if ($selectedTab != '') {
			save();
		}
	}

	/**
	 * Called when the user presses a key while using the application
	 * @param e The event that triggered this function.
	 */
	function keydown(e: KeyboardEvent) {
		if (e.ctrlKey) {
			switch (e.code) {
				case 'KeyB':
					e.preventDefault();
					collapsed ? openSidebar() : collapseSidebar();
					break;
				case 'KeyS':
					e.preventDefault();
					handleSave();
					break;
			}
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
	onMount(async () => {
		if ($standalone) {
			loadStandalone();
		} else {
			loadExercise();
		}

		// Add a listener for application-wide keyboard shortcuts
		window.addEventListener('keydown', keydown);

		if (await auth.isAdmin($auth)) {
			sidebarTabs.push({
				name: 'admin',
				component: Admin,
				icon: IoIosBuild
			});
			sidebarTabs = sidebarTabs;
		}
	});
</script>

<div class="h-screen text-light-text dark:text-dark-text dark:bg-dark-bglight flex flex-row">
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
