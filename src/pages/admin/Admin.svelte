<script lang="ts">
	import Button from '../../components/auth/Button.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';
	import Input from '../../components/auth/Input.svelte';
	import type { AuthError } from 'src/utils/types';
	import AdminFeedback from '../../components/admin/AdminFeedback.svelte';

	let loading = false;
	let method: 'default' | 'google' | 'github';
	let email: string;
	let password: string;
	let error: AuthError;
	let authenticated = false;

	async function signIn() {
		authenticated =
			email === import.meta.env.VITE_ADMIN_EMAIL &&
			password === import.meta.env.VITE_ADMIN_PASSWORD;
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	{#if !authenticated}
		<div class="w-96 flex flex-col">
			<h1 class="text-3xl font-bold mb-10">Control panel</h1>
			<Input placeholder="Email" type="email" icon={true} classes="mb-3" bind:value={email}>
				<IoMdPerson />
			</Input>
			<Input
				placeholder="Password"
				type="password"
				icon={true}
				classes="mb-3"
				bind:value={password}
			>
				<IoMdLock />
			</Input>

			<Button
				text="Sign in"
				on:click={() => signIn()}
				classes="hover:bg-blue-800 bg-blue-600"
				loading={loading && method == 'default'}
			/>

			{#if error}
				<div class="bg-red-900 text-red-400 bg-opacity-50 p-3 mb-3 rounded">
					<p class="font-bold">{error.errorCode}</p>
					<p>
						{error.errorMessage}
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<AdminFeedback />
	{/if}
</div>
