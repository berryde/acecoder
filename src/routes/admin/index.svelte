<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import Button from 'src/components/common/Button.svelte';
	import Claim from 'src/components/admin/Claim.svelte';
	import { getDocs, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { db } from 'src/utils/firebase';
	import type { Project } from 'src/utils/types';
	import Website from 'svelte-icons/io/IoIosDesktop.svelte';
	import Icon from 'src/components/common/Icon.svelte';

	interface ProjectID extends Project {
		id: string;
	}
	let projects: ProjectID[];
	let loading = true;
	onMount(async () => {
		loading = true;
		const snapshot = await getDocs(collection(db, 'projects'));
		projects = snapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Project)
		})) as ProjectID[];
		loading = false;
	});

	function openProject(id: string) {
		window.location.href = 'project/edit/' + id;
	}
</script>

<PrivateRoute restricted={true} {loading}>
	<div
		class="w-screen h-screen bg-brand-editor-background flex justify-center items-center text-brand-text"
	>
		<div class="flex-grow max-w-6xl h-full p-28 space-y-5">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Admin dashboard</p>
				<ProfileMenu />
			</div>
			<Claim />
			<div class="flex flex-row items-center justify-between bg-brand-accent p-5 rounded">
				<div>
					<p class="font-bold">Create something new</p>
					<p>Open the project editor to create a new project</p>
				</div>
				<Button
					text="New project"
					on:click={() => {
						window.location.href = '/project/edit/new';
					}}
				/>
			</div>
			<div class="flex flex-row">
				{#each projects as project}
					<div
						class="bg-brand-accent rounded w-52 cursor-pointer"
						on:click={() => openProject(project.id)}
					>
						<div
							class="bg-gradient-to-r from-green-500 to-green-700 w-full h-20 rounded-t flex justify-center items-center"
						>
							<Icon size="large">
								<Website />
							</Icon>
						</div>
						<div class="p-3">
							<p>{project.name}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PrivateRoute>
