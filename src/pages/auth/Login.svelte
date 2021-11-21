<script>
	import Button from '../../components/auth/Button.svelte';
	import { navigate } from 'svelte-routing';
	import IoLogoGoogle from 'svelte-icons/io/IoLogoGoogle.svelte';
	import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import { user } from '../../utils/auth/auth';
	import { goto } from '$app/navigation';

	function signIn() {
		$user = true;
		goto('/');
	}
</script>

<div
	class="w-full h-screen bg-dark-bgdark flex flex-col justify-center items-center text-dark-text"
>
	<div class="w-96 flex flex-col">
		<h1 class="text-3xl font-bold mb-10">Welcome back</h1>
		<input placeholder="Username" class="p-2 rounded bg-dark-bglight mb-3" />
		<input placeholder="Password" class="p-2 rounded bg-dark-bglight mb-3" />
		<Button text="Sign in" on:click={() => signIn()} />

		<div class="flex flex-row justify-center items-center mx-24 my-12">
			<hr class="border-dark-text flex-grow mr-3" />
			<p class="">or</p>
			<hr class="border-dark-text flex-grow ml-3" />
		</div>
		<div class="mb-3">
			<Button text="Sign in with Google" icon={true} color="dark"><IoLogoGoogle /></Button>
		</div>
		<div>
			<Button text="Sign in with GitHub" icon={true} color="dark"><IoLogoGithub /></Button>
		</div>
		<span class="mt-3"
			>Don't have an account? <a href="signup" class="text-blue-600">Sign up</a></span
		>
	</div>
</div>
