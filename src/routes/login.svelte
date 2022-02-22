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
	import Logo from 'src/components/navbar/Logo.svelte';

	let loading = false;
	let method: 'default' | 'google' | 'github';
	let email: string;
	let password: string;
	let error: AuthError | undefined;

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
	<title>Login - Acecoder</title>
</svelte:head>

<div
	class="w-full h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
>
	<div class="w-96 flex flex-col space-y-3">
		<div class="flex justify-center w-full pb-14">
			<Logo variant="light" size="large" link={false} />
		</div>
		<h1 class="text-3xl font-bold mb-10">Welcome back</h1>
		<Input placeholder="Email" type="email" icon={true} bind:value={email} expanded={true}>
			<IoMdPerson />
		</Input>
		<Input placeholder="Password" type="password" icon={true} bind:value={password} expanded={true}>
			<IoMdLock />
		</Input>

		<a
			class="text-right pb-3 text-brand-primary textlink whitespace-nowrap"
			href="/account-recovery"
		>
			Forgot your password?
		</a>

		<Button
			text="Sign in"
			on:click={() => signIn()}
			loading={loading && method == 'default'}
			expanded={true}
		/>

		{#if error}
			<div class="bg-brand-danger-dark bg-opacity-50 text-brand-danger-light p-3 mt-3 rounded">
				<p class="font-bold">{error.errorCode}</p>
				<p>
					{error.errorMessage}
				</p>
			</div>
		{/if}

		<div class="flex flex-row justify-center items-center mx-24 my-12">
			<hr class="border-brand-text flex-grow mr-3" />
			<p class="">or</p>
			<hr class="border-brand-text flex-grow ml-3" />
		</div>
		<div class="space-y-3">
			<Button
				text="Sign in with Google"
				icon={true}
				loading={loading && method == 'google'}
				variant="accent"
				expanded={true}
				on:click={() => signInWith('google')}
			>
				<IoLogoGoogle />
			</Button>
			<Button
				text="Sign in with GitHub"
				icon={true}
				loading={loading && method == 'github'}
				variant="accent"
				expanded={true}
				on:click={() => signInWith('github')}
			>
				<IoLogoGithub />
			</Button>
		</div>
		<span class="mt-3"
			>Don't have an account? <a href="register" class="text-brand-primary">Sign up</a></span
		>
	</div>
</div>
