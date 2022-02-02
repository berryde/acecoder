<script>
	import Icon from '../common/Icon.svelte';
	import Code from 'svelte-icons/io/IoIosCode.svelte';
	import ProfileMenu from '../profile/ProfileMenu.svelte';
</script>

<div class="bg-brand-accent w-full flex flex-row px-10 py-2 items-center justify-between">
	<div class="flex space-x-5">
		<Icon size="large">
			<Code />
		</Icon>
		<a href="/">Home</a>
	</div>
	<ProfileMenu />
</div>
