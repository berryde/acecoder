<script lang="ts">
	import Button from 'src/components/common/Button.svelte';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';
	import Input from 'src/components/common/Input.svelte';
	import {
		signIn as _signIn,
		signInWith as _signInWith,
		getErrorMessage
	} from 'src/utils/auth/auth';
	import type { AuthError } from 'src/utils/types';

	let loading = false;
	let method: 'default' | 'google' | 'github';
	let email: string;
	let password: string;
	let error: AuthError;

	async function signIn() {
		if (email == '' || !/\S+@\S+\.\S+/.test(email)) {
			error = {
				errorCode: 'Email invalid',
				errorMessage: 'Please provide a valid email address.'
			};
		} else if (password == '') {
			error = {
				errorCode: 'Password invalid',
				errorMessage: 'Please provide a valid password'
			};
		}
		method = 'default';
		error = undefined;
		loading = true;
		const result = await _signIn(email, password);
		loading = false;

		if (result) error = getErrorMessage(result);
	}

	async function signInWith(provider: 'github' | 'google') {
		method = provider;
		error = undefined;
		loading = true;
		const result = await _signInWith(provider);
		loading = false;
		if (result) error = getErrorMessage(result);
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

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

		<a class="text-right pb-3 text-blue-700 textlink whitespace-nowrap" href="/account-recovery">
			Forgot your password?
		</a>

		<Button
			text="Sign in"
			on:click={() => signIn()}
			classes="hover:bg-blue-800 bg-blue-700"
			loading={loading && method == 'default'}
		/>

		{#if error}
			<div class="bg-red-900 text-red-400 bg-opacity-50 p-3 mt-3 rounded">
				<p class="font-bold">{error.errorCode}</p>
				<p>
					{error.errorMessage}
				</p>
			</div>
		{/if}

		<div class="flex flex-row justify-center items-center mx-24 my-12">
			<hr class="border-dark-text flex-grow mr-3" />
			<p class="">or</p>
			<hr class="border-dark-text flex-grow ml-3" />
		</div>

		<Button
			text="Sign in with Google"
			icon={true}
			loading={loading && method == 'google'}
			classes="hover:bg-opacity-50 bg-dark-bglight mb-3"
			on:click={() => signInWith('google')}
		>
			<IoLogoGoogle />
		</Button>
		<Button
			text="Sign in with GitHub"
			icon={true}
			loading={loading && method == 'github'}
			classes="hover:bg-opacity-50 bg-dark-bglight"
			on:click={() => signInWith('github')}
		>
			<IoLogoGithub />
		</Button>
		<span class="mt-3"
			>Don't have an account? <a href="register" class="text-blue-700">Sign up</a></span
		>
	</div>
</div>
