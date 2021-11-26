<script lang="ts">
	import { post } from 'src/utils/network/network';
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
		const data = {
			uid: uid,
			claim: {
				admin: true
			}
		};
		const result = await post('/api/claims', data);
		success = result['success'] as boolean;
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
	<div class="flex flex-row w-full">
		<Input placeholder="User ID" bind:value={uid} classes="w-full" />
		<Button text="Add" classes="bg-blue-700 ml-3 w-20 flex-shrink" {loading} on:click={submit} />
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
