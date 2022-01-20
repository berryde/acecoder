<script lang="ts">
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import ProjectSettings from 'src/components/admin/ProjectSettings.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
</script>

<PrivateRoute restricted={true}>
	<div
		class="w-screen h-screen bg-brand-editor-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">New project</p>
				<ProfileImage />
			</div>
			<ProjectSettings creating={true} />
		</div>
	</div>
</PrivateRoute>
