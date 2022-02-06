<script lang="ts">
	import { getErrorMessage, resetPassword } from 'src/utils/auth/auth';
	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import type { AuthError } from 'src/utils/types';

	let email: string = '';
	let loading = false;
	let error: AuthError;
	let success: boolean;

	async function handleReset() {
		if (email != '') {
			loading = true;

			const result = await resetPassword(email);
			if (result) {
				error = getErrorMessage(result);
				success = false;
			} else {
				email = '';
				success = true;
			}

			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Account Recovery</title>
</svelte:head>

<div
	class="w-full h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
>
	<div class="w-96 flex flex-col space-y-3">
		<h1 class="text-3xl font-bold mb-3">Account recovery</h1>
		<p class="mb-3 text-xs">
			Forgotten your password or unable to login? Submit your email address below to recieve a
			recovery link.
		</p>
		<Input placeholder="Email" type="email" icon={true} bind:value={email}>
			<IoMdPerson />
		</Input>
		<Button text="Send recovery email" on:click={() => handleReset()} {loading} />
		{#if error}
			<div class="bg-red-900 text-red-400 bg-opacity-50 p-3 mt-3 rounded">
				<p class="font-bold">{error.errorCode}</p>
				<p>
					{error.errorMessage}
				</p>
			</div>
		{:else if success}
			<div class="bg-green-900 text-green-400 bg-opacity-50 p-3 mt-3 rounded">
				<p>
					Recovery email sent successfully. Please check your inbox for steps on how to recover your
					account.
				</p>
			</div>
		{/if}
	</div>
</div>
