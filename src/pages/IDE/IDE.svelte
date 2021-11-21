<script lang="ts">
	import SplitPane from '../../components/splitpane/SplitPane.svelte';

	import { darkMode } from '../../utils/settings/settings';

	import Sidebar from '../../components/sidebar/Sidebar.svelte';
	import { filesystem } from '../../utils/filesystem/filesystem';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import Explorer from '../../components/explorer/Explorer.svelte';
	import Feedback from '../../components/feedback/Feedback.svelte';
	import Settings from '../../components/settings/Settings.svelte';
	import { onMount } from 'svelte';

	/**
	 *
	 */
	let selecting = false;
	function toggleSelecting(e: CustomEvent<boolean>) {
		selecting = e.detail;
	}

	/**
	 * The selected sidebar item's index.
	 */
	let selected = 0;

	let collapsed = false;

	function updateSidebar(updatedIndex: number | undefined) {
		selected = updatedIndex;
		collapsed = false;
	}

	function keydown(e: KeyboardEvent) {
		if (e.code == 'KeyB' && e.ctrlKey) {
			e.preventDefault();
			collapsed = !collapsed;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', keydown);
	});
</script>

<div
	class="h-screen {$darkMode &&
		'dark'} text-light-text dark:text-dark-text dark:bg-dark-bglight flex flex-row"
>
	<Sidebar
		on:collapse={() => (collapsed = true)}
		on:select={(e) => updateSidebar(e.detail)}
		{collapsed}
		{selected}
	/>
	<SplitPane
		isHorizontal={true}
		minPane1Size={collapsed ? '0' : undefined}
		pane1Size={collapsed ? 0 : 13}
		pane2Size={collapsed ? 100 : 87}
		on:resize={() => (collapsed = false)}
	>
		<div slot="pane1" class="bg-dark-bgdark">
			{#if !collapsed}
				{#if selected == 0}
					<Explorer files={$filesystem} />
				{:else if selected == 1}
					<Feedback />
				{:else if selected == 2}
					<Settings />
				{/if}
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
