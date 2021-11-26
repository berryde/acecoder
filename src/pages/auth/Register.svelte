<script lang="ts">
	import Button from 'src/components/common/Button.svelte';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import { auth } from 'src/utils/auth/auth';
	import Input from 'src/components/common/Input.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';
	import type { AuthError } from 'src/utils/types';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let error: AuthError;

	async function submit() {
		if (email == '') {
			error = {
				errorCode: 'Invalid email',
				errorMessage: 'Please provide a valid email and try again.'
			};
		} else if (password == '') {
			error = {
				errorCode: 'Invalid password',
				errorMessage: 'Please provide a valid password and try again.'
			};
		} else if (password != confirmPassword) {
			error = {
				errorCode: "Those passwords don't match",
				errorMessage: 'Please try again, ensuring that you type both passwords correctly.'
			};
		} else {
			const result = await auth.register(email, password);

			if (typeof result != 'undefined') error = result;
		}
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	<div class="w-96 flex flex-col">
		<h1 class="text-3xl font-bold mb-10">Create an account</h1>

		<Input placeholder="Email" type="email" icon={true} classes="mb-3" bind:value={email}>
			<IoMdPerson />
		</Input>
		<Input placeholder="Password" type="password" icon={true} classes="mb-3" bind:value={password}>
			<IoMdLock />
		</Input>
		<Input
			placeholder="Confifrm password"
			type="password"
			icon={true}
			classes="mb-3"
			bind:value={confirmPassword}
		>
			<IoMdLock />
		</Input>

		<Button text="Sign up" on:click={() => submit()} classes="hover:bg-blue-800 bg-blue-600" />

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
			text="Sign up with Google"
			icon={true}
			classes="hover:bg-opacity-50 bg-dark-bglight mb-3"
			on:click={() => {
				auth.signInWith('google');
			}}><IoLogoGoogle /></Button
		>
		<Button
			text="Sign up with GitHub"
			icon={true}
			classes="hover:bg-opacity-50 bg-dark-bglight"
			on:click={() => {
				auth.signInWith('github');
			}}><IoLogoGithub /></Button
		>
		<span class="mt-3"
			>Already have an account? <a href="login" class="text-blue-600">Sign in</a></span
		>
	</div>
</div>
