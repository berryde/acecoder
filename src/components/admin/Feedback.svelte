<script lang="ts">
	import { getDocs, getFirestore, collection, Timestamp } from 'firebase/firestore';
	import { app } from 'src/utils/firebase';
	import type { Feedback } from 'src/utils/types';
	import { onMount } from 'svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';

	let feedback: Feedback[] = [];
	let loading = false;

	type FeedbackEntry = {
		comment: string;
		component: string;
		posted: {
			seconds: number;
			nanoseconds: number;
		};
	};
	async function getFeedback() {
		const db = getFirestore(app);
		loading = true;
		const querySnapshot = await getDocs(collection(db, 'feedback'));
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots

			const data = doc.data() as FeedbackEntry;

			const date = new Timestamp(data.posted.seconds, data.posted.nanoseconds);

			feedback.push({
				comment: data.comment,
				component: data.component,
				posted: date.toDate().toDateString()
			});
			feedback = feedback;
		});
		loading = false;
	}

	onMount(() => {
		getFeedback();
	});
</script>

<div class="px-3">
	<p class="pt-3 pb-1 uppercase text-xs dark:text-dark-text text-light-text">Feedback</p>
	{#if loading}
		<div class="flex justify-center items-center w-full">
			<CircularProgressIndicator />
		</div>
	{:else}
		{#each feedback as submission}
			<div class="bg-light-bglight dark:bg-dark-bglight p-3 mb-3 rounded">
				<div class="flex flex-row">
					<p class="font-bold">{submission.component}</p>
				</div>
				<p class="text-sm ">
					{submission.comment}
				</p>
			</div>
		{/each}
	{/if}
</div>
