<script lang="ts">
	import Button from 'src/components/common/Button.svelte';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import IoIosMail from 'svelte-icons/io/IoIosMail.svelte';
	import { getErrorMessage, register, signInWith } from 'src/utils/auth/auth';
	import Input from 'src/components/common/Input.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';
	import type { AuthError } from '~shared/types';
	import Logo from 'src/components/navbar/Logo.svelte';

	/**
	 * The email address of the user
	 */
	let email = '';

	/**
	 * The password of the user
	 */
	let password = '';

	/**
	 * The name of the user
	 */
	let name = '';

	/**
	 * The password of the user, again
	 */
	let confirmPassword = '';

	/**
	 * An error thrown if authentication fails
	 */
	let error: AuthError;

	/**
	 * Whether the authentication is pending
	 */
	let loading = false;

	/**
	 * Submit the form to register the user
	 */
	async function submit() {
		loading = true;
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
		} else if (name == '') {
			error = {
				errorCode: 'Invalid full name',
				errorMessage:
					'Please provide your full name as it will appear on any certificates you unlock.'
			};
		} else {
			const result = await register(email, password, name);
			if (result && getErrorMessage(result)) error = getErrorMessage(result)!;
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Register - Acecoder</title>
</svelte:head>

<div
	class="w-full h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
>
	<div class="w-96 flex flex-col space-y-3">
		<div class="flex justify-center w-full pb-14">
			<Logo variant="light" size="large" link={false} />
		</div>
		<h1 class="text-3xl font-bold mb-10">Create an account</h1>
		<Input placeholder="Email" type="email" icon={true} bind:value={email} expanded={true}>
			<IoIosMail />
		</Input>
		<Input placeholder="Full name" icon={true} bind:value={name} expanded={true}>
			<IoMdPerson />
		</Input>
		<Input placeholder="Password" type="password" icon={true} bind:value={password} expanded={true}>
			<IoMdLock />
		</Input>
		<Input
			placeholder="Confirm password"
			type="password"
			icon={true}
			bind:value={confirmPassword}
			expanded={true}
		>
			<IoMdLock />
		</Input>

		<Button text="Sign up" on:click={() => submit()} expanded={true} {loading} />

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
			variant="accent"
			expanded={true}
			on:click={() => {
				signInWith('google');
			}}><IoLogoGoogle /></Button
		>
		<Button
			text="Sign up with GitHub"
			icon={true}
			variant="accent"
			expanded={true}
			on:click={() => {
				signInWith('github');
			}}><IoLogoGithub /></Button
		>
		<span class="mt-3"
			>Already have an account? <a href="login" class="text-brand-primary">Sign in</a></span
		>
	</div>
</div>
