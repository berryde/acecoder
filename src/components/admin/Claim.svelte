<script lang="ts">
	import { setClaim } from 'src/utils/firebase';
	import Button from '../common/Button.svelte';
	import Input from '../common/Input.svelte';
	let loading = false;
	let message: string;
	let success: boolean;
	let uid = '';

	async function submit() {
		if (uid == '') {
			message = 'Please provide a valid UID';
			return;
		}
		loading = true;

		success = await setClaim({
			admin: true
		});

		if (success) {
			message = 'Claim updated successfully';
		} else {
			message = 'Unable update claim for that user';
		}
		loading = false;
	}
</script>

<div class="w-full px-3">
	<div class="uppercase text-xs pb-1">Add admin claim</div>
	<Input placeholder="User ID" bind:value={uid} classes="w-full" />
	<Button
		text="Add"
		classes="bg-light-bglight text-light-text hover:bg-opacity-50 dark:bg-dark-bglight dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-2"
		{loading}
		on:click={submit}
	/>
	{#if message}
		<div
			class="{success
				? 'bg-green-900 text-green-500'
				: 'bg-red-900 text-red-500'} bg-opacity-50  p-3 mt-3 rounded"
			on:click={() => (message = undefined)}
		>
			{message}
		</div>
	{/if}
</div>
