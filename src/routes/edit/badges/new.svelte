<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import { db, storage } from 'src/utils/firebase';
	import type { Badge } from 'src/utils/types';
	import { doc, setDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';

	let loading = false;
	let submitting = false;
	let badge: Badge = {
		description: '',
		image: '',
		name: '',
		reward: 0
	};
	let id = '';
	let errors: string[] = [];
	let files: FileList;

	async function uploadImage() {
		try {
			const name = `images/${id}.svg`;
			const location = ref(storage, name);
			await uploadBytes(location, files[0]);
			badge.image = `gs://folio-8b029.appspot.com/${name}`;
		} catch (err) {
			errors.push('Unable to upload that image');
		}
	}

	async function handleSubmit() {
		submitting = true;
		if (badge.description == '') errors.push('Please provide a badge description');
		if (badge.name == '') errors.push('Please provide a name');
		if (id == '') errors.push('Please provide an ID');
		if (badge.reward < 0) errors.push('Badge reward must be a positive integer');
		if (!files || files.length == 0) errors.push('Please provide an image');

		if (errors.length == 0) {
			try {
				await uploadImage();
				await setDoc(doc(db, 'badges', id), badge);
			} catch (err) {
				errors.push('Unable to create that badge. Please try again later');
			}
		}
		submitting = false;
		errors = errors;
	}
</script>

<PrivateRoute restricted={true} {loading}>
	<div
		class="w-screen h-screen bg-brand-editor-background flex flex-col justify-center items-center text-brand-text"
	>
		<div class="flex-grow max-w-6xl w-full h-full p-28 space-y-5">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">New badge</p>
				<ProfileMenu showScore={false} />
			</div>
			<div class="space-y-1">
				<p class="font-bold">Badge ID</p>
				<p>
					A reference that uniquely identifies the badge, such as the associated project ID or a
					language milestone.
				</p>
				<Input placeholder="Badge ID" bind:value={id} />
			</div>
			<div class="space-y-1">
				<p class="font-bold">Name</p>
				<p>A name that will be displayed to the user, such as 'My Awesome Badge'.</p>
				<Input placeholder="Name" bind:value={badge.name} />
			</div>
			<div class="space-y-1">
				<p class="font-bold">Description</p>
				<p>A explanation for why this badge was awarded.</p>
				<textarea
					placeholder="Awarded for..."
					class="bg-brand-accent rounded w-full p-2"
					bind:value={badge.description}
				/>
			</div>

			<div class="space-y-1">
				<p class="font-bold">Image</p>
				<p>An SVG image representing the badge.</p>
				{#if files && files.length > 0}
					<div class="p-3">
						<img
							src={URL.createObjectURL(files[0])}
							alt="Preview of upload"
							class="w-16 h-16 rounded-full"
						/>
					</div>
				{/if}
				<input type="file" accept="svg" bind:files />
			</div>
			<div class="space-y-1">
				<p class="font-bold">Reward</p>
				<p>The number of points to be credited to the user's account upon unlocking this badge.</p>
				<input type="number" class="p-2 bg-brand-accent rounded" bind:value={badge.reward} />
			</div>
			<div class="flex justify-end">
				<Button text="Submit" on:click={handleSubmit} loading={submitting} />
			</div>

			{#if errors.length > 0}
				<div class="bg-brand-danger-dark bg-opacity-50 p-3 rounded text-brand-danger-light">
					<p>The following errors were found with this form:</p>
					<ol class="list-decimal flex-col pl-8">
						{#each errors as error}
							<li>{error}</li>
						{/each}
					</ol>
				</div>
			{/if}
		</div>
	</div>
</PrivateRoute>
