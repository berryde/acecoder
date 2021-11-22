<script lang="ts">
	import Button from '../../components/auth/Button.svelte';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import { federatedLogin, user } from '../../utils/auth/auth';
	import { goto } from '$app/navigation';
	import Input from '../../components/auth/Input.svelte';
	import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
	import IoMdLock from 'svelte-icons/io/IoMdLock.svelte';

	function register() {
		goto('/');
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	<div class="w-96 flex flex-col">
		<h1 class="text-3xl font-bold mb-10">Create an account</h1>

		<Input placeholder="Email" type="email" icon={true} classes="mb-3">
			<IoMdPerson />
		</Input>
		<Input placeholder="Password" type="password" icon={true} classes="mb-3">
			<IoMdLock />
		</Input>
		<Input placeholder="Confifrm password" type="password" icon={true} classes="mb-3">
			<IoMdLock />
		</Input>

		<Button text="Sign up" on:click={() => register()} classes="hover:bg-blue-800 bg-blue-600" />
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
				federatedLogin('google');
			}}><IoLogoGoogle /></Button
		>
		<Button
			text="Sign up with GitHub"
			icon={true}
			classes="hover:bg-opacity-50 bg-dark-bglight"
			on:click={() => {
				federatedLogin('github');
			}}><IoLogoGithub /></Button
		>
		<span class="mt-3"
			>Already have an account? <a href="login" class="text-blue-600">Sign in</a></span
		>
	</div>
</div>
