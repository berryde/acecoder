<script lang="ts">
	import { page } from '$app/stores';

	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import type { Badge } from 'src/utils/types';
	import { onMount } from 'svelte';
	import { db, storage, getImage } from 'src/utils/firebase';
	import { doc, setDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';
	import Hoverable from 'src/components/common/Hoverable.svelte';
	import Icon from 'src/components/common/Icon.svelte';
	import Close from 'svelte-icons/io/IoIosClose.svelte';

	export let creating = false;
	export let badge: Badge = {
		description: '',
		image: '',
		name: '',
		reward: 0,
		conditions: {}
	};
	let editing = creating;
	let id: string = '';

	let loading = false;
	let errors: string[] = [];
	let files: FileList;
	let url: string;

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
		loading = true;
		if (badge.description == '') errors.push('Please provide a badge description');
		if (badge.name == '') errors.push('Please provide a name');
		if (id == '') errors.push('Please provide an ID');
		if (badge.reward < 0) errors.push('Badge reward must be a positive integer');
		if (!url && (!files || files.length == 0)) errors.push('Please provide an image');

		if (errors.length == 0) {
			try {
				if (!!files && files.length > 0) {
					await uploadImage();
				}
				await setDoc(doc(db, 'badges', id), badge);
			} catch (err) {
				console.error(err);
				errors.push(
					`Unable to ${creating ? 'create' : 'update'} that badge. Please try again later`
				);
			}
		}
		loading = false;
		errors = errors;
	}

	onMount(async () => {
		if (!creating) {
			id = $page.params.badgeID;
			url = await getImage(badge.image);
		}
	});

	function toggleEdit() {
		editing = !editing;
	}

	let conditionKey: string;
	let conditionValue: number;
	function addCondition() {
		badge.conditions[conditionKey] = conditionValue;
		conditionKey = '';
		conditionValue = undefined;
	}

	function deleteCondition(key: string) {
		delete badge.conditions[key];
		conditionKey = '';
		conditionValue = undefined;
	}
</script>

<div class="flex flex-col w-full space-y-8">
	<div class="flex flex-row items-center justify-between">
		<p class="text-3xl font-bold">{creating ? 'New badge' : 'Badge editor'}</p>
		<ProfileMenu showScore={false} />
	</div>
	<div class="flex flex-col bg-brand-accent p-8 rounded space-y-3">
		<div class="flex flex-row w-full justify-between items-center">
			<p class="text-xl font-bold">Settings</p>
			{#if !creating && !editing}
				<p class="text-brand-primary cursor-pointer" on:click={toggleEdit}>Edit</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Badge ID</p>
			{#if creating && editing}
				<Input placeholder="Badge ID" bind:value={id} variant="dark" />
			{:else}
				<code class="bg-brand-background p-1 rounded">{id}</code>
			{/if}
		</div>
		<div>
			<p class="font-bold">Name</p>
			{#if editing}
				<Input placeholder="Name" bind:value={badge.name} variant="dark" />
			{:else}
				<p>{badge.name}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Description</p>
			{#if editing}
				<textarea
					placeholder="Awarded for..."
					class="bg-brand-background rounded w-full p-2"
					bind:value={badge.description}
				/>
			{:else}
				<p>{badge.description}</p>
			{/if}
		</div>
		<div>
			<p class="font-bold">Image</p>
			<p class="text-sm mb-1">An SVG image representing the badge.</p>
			{#if (files && files.length > 0) || url}
				<div class="p-3">
					<img
						src={url ? url : URL.createObjectURL(files[0])}
						alt="Preview of upload"
						class="w-16 h-16 rounded-full"
					/>
				</div>
			{/if}
			{#if editing}
				<input type="file" accept="svg" bind:files />
			{/if}
		</div>
		<div>
			<p class="font-bold">Conditions</p>
			<div class="space-y-1">
				{#each Object.keys(badge.conditions) as condition}
					<Hoverable let:hovering>
						<div class="flex items-center space-x-3">
							<p class="bg-brand-background px-1 py-0.5 max-w-max rounded cursor-default">
								{condition} : {badge.conditions[condition]}
							</p>
							{#if hovering && editing}
								<Icon card={true} button={true} on:click={() => deleteCondition(condition)}>
									<Close />
								</Icon>
							{/if}
						</div>
					</Hoverable>
				{/each}
			</div>
			{#if editing}
				<div class="flex space-x-3 mt-2">
					<Input placeholder="Key" variant="dark" bind:value={conditionKey} />
					<input
						type="number"
						class="p-2 bg-brand-background rounded w-32"
						placeholder="Value"
						bind:value={conditionValue}
					/>
					<Button text="Add" outline={true} on:click={addCondition} />
				</div>
			{/if}
		</div>
		<div>
			<p class="font-bold">Reward</p>
			<p class="text-sm mb-1">
				The number of points to be credited to the user's account upon unlocking this badge.
			</p>
			{#if editing}
				<input type="number" class="p-2 bg-brand-background rounded" bind:value={badge.reward} />
			{:else}
				<p>{badge.reward}</p>
			{/if}
		</div>

		{#if editing}
			<div class="flex justify-end">
				<Button text={creating ? 'Submit' : 'Update'} on:click={handleSubmit} {loading} />
			</div>
		{/if}

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
