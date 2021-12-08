<script lang="ts">
	import { auth, getErrorMessage } from 'src/utils/auth/auth';
	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import type { AuthError } from 'src/utils/types';

	let email: string = '';
	let loading = false;
	let error: AuthError;

	async function handleReset() {
		if (email != '') {
			loading = true;
			const result = await auth.resetPassword(email);
			if (result) error = getErrorMessage(result);
			loading = false;
		}
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	<div class="w-96 flex flex-col">
		<h1 class="text-3xl font-bold mb-10">Account recovery</h1>
		<p class="mb-3 text-xs">
			Forgotten your password or unable to login? Submit your email address below to recieve a
			recovery link.
		</p>
		<Input placeholder="Email" type="email" icon={true} classes="mb-3" bind:value={email}>
			<IoMdPerson />
		</Input>

		<Button
			text="Send recovery email"
			on:click={() => handleReset()}
			classes="hover:bg-blue-800 bg-blue-600"
			{loading}
		/>

		{#if error}
			<div class="bg-red-900 text-red-400 bg-opacity-50 p-3 mt-3 rounded">
				<p class="font-bold">{error.errorCode}</p>
				<p>
					{error.errorMessage}
				</p>
			</div>
		{/if}
	</div>
</div>
