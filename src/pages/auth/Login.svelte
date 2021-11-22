<script lang="ts">
	import Button from '../../components/auth/Button.svelte';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';
	import { user, login, federatedLogin } from '../../utils/auth/auth';
	import { goto } from '$app/navigation';
	import Input from '../../components/auth/Input.svelte';
	import type { AuthError } from 'src/utils/types';

	let loading = false;
	let email: string;
	let password: string;
	let error: AuthError;

	async function signIn() {
		error = undefined;
		loading = true;
		const result = await login(email, password);
		loading = false;

		if (typeof result == 'undefined' && $user) {
			goto('/');
		} else {
			error = result;
		}
	}

	async function federatedSignIn(provider: 'github' | 'google') {
		error = undefined;

		const result = await federatedLogin(provider);

		if (typeof result == 'undefined' && $user) {
			goto('/');
		} else {
			error = result;
		}
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	<div class="w-96 flex flex-col">
		<h1 class="text-3xl font-bold mb-10">Welcome back</h1>
		<Input placeholder="Email" type="email" icon={true} classes="mb-3" bind:value={email}>
			<IoMdPerson />
		</Input>
		<Input placeholder="Password" type="password" icon={true} classes="mb-3" bind:value={password}>
			<IoMdLock />
		</Input>

		{#if error}
			<div class="bg-red-900 text-red-400 bg-opacity-50 p-3 mb-3 rounded">
				<p class="text-bold">{error.errorCode}</p>
				<p>
					{error.errorMessage}
				</p>
			</div>
		{/if}

		<Button text="Sign in" on:click={() => signIn()} classes="hover:bg-blue-800 bg-blue-600" />

		<div class="flex flex-row justify-center items-center mx-24 my-12">
			<hr class="border-dark-text flex-grow mr-3" />
			<p class="">or</p>
			<hr class="border-dark-text flex-grow ml-3" />
		</div>

		<Button
			text="Sign in with Google"
			icon={true}
			classes="hover:bg-opacity-50 bg-dark-bglight mb-3"
			on:click={(e) => federatedSignIn('google')}
		>
			<IoLogoGoogle />
		</Button>
		<Button
			text="Sign in with GitHub"
			icon={true}
			classes="hover:bg-opacity-50 bg-dark-bglight"
			on:click={(e) => federatedSignIn('github')}
		>
			<IoLogoGithub />
		</Button>
		<span class="mt-3"
			>Don't have an account? <a href="register" class="text-blue-600">Sign up</a></span
		>
	</div>
</div>
