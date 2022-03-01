<script lang="ts">
	import { setClaim } from 'src/utils/firebase';
	import Button from '../common/Button.svelte';
	import Input from '../common/Input.svelte';
	let loading = false;
	let message: string | undefined;
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

<div class="w-full bg-brand-accent rounded p-5 space-y-1">
	<div class="font-bold">Add admin claim</div>
	<div class="flex flex-row space-x-3">
		<Input placeholder="User ID" bind:value={uid} variant="dark" />
		<Button text="Add" {loading} on:click={submit} />
	</div>
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
