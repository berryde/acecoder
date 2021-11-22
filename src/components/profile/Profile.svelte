<script>
	import { auth } from '../../utils/auth/auth';

	import Button from '../auth/Button.svelte';
</script>

<div class="px-3">
	<p class="uppercase text-xs">Account</p>
	<p class="leading-5">
		If you are having trouble logging in, <a class="text-blue-600" href="/reset"
			>reset your password</a
		>.
	</p>

	<p class="uppercase text-xs mt-3">Contact</p>
	<p class="leading-5">
		To contact the developers, please <a class="text-blue-600" href="/reset">send us an email</a> and
		we will try our best to get back to you.
	</p>
	<Button
		text="Sign out"
		classes="bg-light-bglight dark:bg-dark-bglight dark:hover:bg-opacity-50 text-light-text dark:text-dark-text h-7 mt-3"
		on:click={() => {
			auth.signOut();
		}}
	/>
</div>
