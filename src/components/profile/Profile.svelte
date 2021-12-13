<script>
	import { goto } from '$app/navigation';
	import { auth } from 'src/utils/firebase';
	import { getName } from 'src/utils/auth/auth';
	import Button from '../common/Button.svelte';
</script>

<div class="px-3">
	<p class="uppercase text-xs">Account</p>
	<p class="leading-5">Hi, {getName()}</p>
	<p class="leading-5">
		If you are having trouble logging in, <a class="text-blue-700" href="/account-recovery"
			>reset your password</a
		>.
	</p>

	<p class="uppercase text-xs mt-3">Contact</p>
	<p class="leading-5">
		To contact the developers, please <a class="text-blue-700" href="mailto: deb1g19@soton.ac.uk"
			>send us an email</a
		> and we will try our best to get back to you.
	</p>
	<Button
		text="Homepage"
		classes="bg-light-bglight dark:bg-dark-bglight dark:hover:bg-opacity-50 text-light-text dark:text-dark-text h-7 mt-3"
		on:click={() => {
			goto('/');
		}}
	/>
	<Button
		text="Sign out"
		classes="bg-light-bglight dark:bg-dark-bglight dark:hover:bg-opacity-50 text-light-text dark:text-dark-text h-7 mt-3"
		on:click={() => {
			auth.signOut();
		}}
	/>
</div>
