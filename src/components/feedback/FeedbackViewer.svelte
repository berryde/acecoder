<script lang="ts">
	import { getDocs, getFirestore, collection, Timestamp } from 'firebase/firestore';
	import { app } from '../../utils/auth/firebase';
	import type { Feedback } from '../../utils/types';
	import { onMount } from 'svelte';

	let feedback: Feedback[] = [];

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
	}

	onMount(() => {
		getFeedback();
	});
</script>

<div class="h-screen w-full text-dark-text overflow-y-auto">
	<div class="w-1/3 mx-auto flex flex-col justify-center">
		<h1 class="text-3xl font-bold my-10">Feedback</h1>
		{#each feedback as submission}
			<div class="bg-dark-bglight p-3 mb-3 rounded">
				<div class="flex flex-row">
					<p class="font-bold text-xl">{submission.component}</p>
				</div>
				<p>
					{submission.comment}
				</p>
				<p class="text-right opacity-50 text-xs">Posted at {submission.posted}</p>
			</div>
		{/each}
	</div>
</div>
