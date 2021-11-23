<script lang="ts">
	import Button from '../auth/Button.svelte';
	import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
	import { app } from '../../utils/auth/firebase';

	async function submitFeedback() {
		if (valid) {
			const db = getFirestore(app);
			loading = true;
			await addDoc(collection(db, 'feedback'), {
				comment: comment,
				component: component,
				posted: Timestamp.now()
			});
			loading = false;
			comment = '';
		}
	}

	let loading = false;
	let comment = '';
	let component = '';

	$: valid = comment != '' && component != '';
</script>

<div class="px-3 h-full">
	<p class="leading-5">Submit anonymous feedback about the application to help improve it.</p>
	<p class="mt-3 uppercase text-xs mb-1">Component</p>
	<select
		class="w-full bg-light-bglight dark:bg-dark-bglight px-2 h-8 focus:outline-none focus:ring-1 focus:ring-bluegray-300"
		bind:value={component}
	>
		<option value="File explorer">File explorer</option>
		<option value="Text editor">Text editor</option>
		<option value="Settings">Settings</option>
		<option value="Live preview">Live preview</option>
		<option value="Console">Console</option>
		<option value="Other">Other</option>
	</select>
	<p class="mt-3 uppercase text-xs mb-1">Comment</p>
	<textarea
		class="w-full dark:bg-dark-bglight focus:outline-none focus:ring-1 focus:ring-bluegray-300 px-3 py-1 h-1/3 resize-none"
		spellcheck={true}
		bind:value={comment}
	/>
	<Button
		text="Submit"
		classes="bg-light-bglight text-light-text hover:bg-opacity-50 dark:bg-dark-bglight dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-2 "
		{loading}
		on:click={() => submitFeedback()}
	/>
</div>
