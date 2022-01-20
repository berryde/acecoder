<script lang="ts">
	import ProjectSettings from 'src/components/admin/ProjectSettings.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import { page } from '$app/stores';
	import Button from 'src/components/common/Button.svelte';
</script>

<PrivateRoute restricted={true}>
	<div
		class="w-screen h-screen bg-brand-editor-background flex justify-center items-center text-brand-text"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Project editor</p>
				<ProfileImage />
			</div>
			<ProjectSettings id={$page.params.slug} />
			<div class="flex flex-col bg-brand-accent p-8 rounded space-y-3">
				<div>
					<p class="text-xl font-bold">Exercises</p>
					<p>Select an exercise to open the exercise editor.</p>
				</div>
				<div class="flex justify-end">
					<Button
						text="New exercise"
						on:click={() => {
							window.location.href = '/exercise/new/' + $page.params.slug;
						}}
					/>
				</div>
			</div>
		</div>
	</div>
</PrivateRoute>
