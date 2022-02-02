<script>
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { onMount } from 'svelte';
	import { getName } from 'src/utils/auth/auth';
	import Button from 'src/components/common/Button.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';

	async function showXP() {
		await new Promise((resolve) => setTimeout(resolve, 200));
		width = 50;
	}

	onMount(() => {
		showXP();
	});

	function getCompliment() {
		const compliments = [
			'Great work',
			'Well done',
			'Good job',
			'Nice work',
			'Nicely done',
			'Fantastic work',
			'Excellent work'
		];
		return compliments[Math.floor(Math.random() * compliments.length)];
	}

	let width = 0;
</script>

<PrivateRoute>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="flex-grow lg:max-w-5xl h-full p-20 space-y-5">
			<div>
				<p class="text-3xl font-bold">{getCompliment()}, {getName()}</p>
				<p class="uppercase ">Project name</p>
			</div>

			<div>
				<div class="h-5 w-full bg-brand-accent rounded">
					<div class="flex">
						<div
							class="h-5 border-brand-background border-r-4 rounded bg-yellow-600 transition-all duration-1000 z-40"
							style="width: 10%;"
						/>
						<div
							class="h-5 bg-gradient-to-r rounded-r flex items-center justify-end pr-5 from-yellow-500 to-yellow-300 transition-all duration-1000"
							style="width: {width}%;"
						>
							<p class="text-brand-background">+30 EXP</p>
						</div>
					</div>
				</div>
				<div class="flex justify-between">
					<p>60/100 EXP</p>
					<div class="text-right">
						<p>40 EXP to next level</p>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<p class="text-xl font-bold">New badges unlocked!</p>
				<div class="flex space-x-5">
					<div
						class="w-36 flex flex-col items-center justify-center p-3 bg-brand-accent rounded text-center"
					>
						<div class="w-16 h-16 rounded-full bg-brand-danger-light my-2" />
						<p class="font-bold">Hello, world!</p>
						<p class="text-xs">Awarded for completing your first project.</p>
					</div>
					<div
						class="w-36 flex flex-col items-center justify-center p-3 bg-brand-accent rounded text-center"
					>
						<div class="w-16 h-16 rounded-full bg-brand-primary my-2" />
						<p class="font-bold">React I</p>
						<p class="text-xs">Awarded for completing a project in React.</p>
					</div>
				</div>
			</div>

			<div class="bg-brand-accent p-5 rounded">
				<p class="text-xl font-bold">Your project</p>
				<p>Download the finished project to share it with the world, or continue working on it.</p>
				<div class="flex justify-end space-x-3 mt-3">
					<Button text="Share on LinkedIn" outline="true" />
					<Button text="Download" />
				</div>
			</div>
		</div>
	</div>
</PrivateRoute>
