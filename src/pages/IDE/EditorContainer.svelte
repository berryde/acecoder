<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, temporaryTab } from '../../utils/tabs/tabs';
	
</script>

<div class="flex flex-col h-full">
	<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} temporary={$temporaryTab} />
	<Editor/>
</div>
