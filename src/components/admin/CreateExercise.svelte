<script lang="ts">
	import { addDoc, collection, doc } from 'firebase/firestore';
	import { db } from 'src/utils/firebase';

	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Button from '../common/Button.svelte';
	import Icon from '../common/Icon.svelte';
	import Input from '../common/Input.svelte';
	import Modal from '../common/Modal.svelte';
	import type { Exercise } from 'src/utils/types';

	let overrides: Record<string, string> = {};
	let tests: Record<string, string> = {};
	let requirements: string[] = [];
	let showing = false;
	let name = '';
	let description = '';
	let template = '';
	let previous = false;
	let testName = '';
	let testSource = '';
	let overrideName = '';
	let overrideSource = '';
	let requirement = '';

	function show() {
		showing = true;
	}

	function hide() {
		showing = false;
	}

	function addTest() {
		tests[testName] = testSource;
		testName = '';
		testSource = '';
	}

	function addOverride() {
		overrides[overrideName] = overrideSource;
		overrideName = '';
		overrideSource = '';
	}

	function deleteTest(name: string) {
		delete tests[name];
		tests = tests;
	}

	function deleteOverride(name: string) {
		delete overrides[name];
		overrides = overrides;
	}

	function addRequirement(requirement: string) {
		requirements.push(requirement);
		requirements = requirements;
		requirement = '';
	}

	function deleteRequirement(requirement: string) {
		const index = requirements.indexOf(requirement);
		requirements.splice(index);
		requirements = requirements;
	}

	let loading = false;
	async function submit() {
		if ([name, description, template].every((e) => e.length > 0) && Object.keys(tests).length > 0) {
			const exercise: Exercise = {
				name: name,
				description: description,
				tests: tests,
				requirements: requirements,
				overrides: overrides
			};
			if (previous) {
				exercise.previous = doc(db, 'exercises', template);
			} else {
				exercise.template = doc(db, 'templates', template);
			}
			loading = true;
			await addDoc(collection(db, 'exercises'), exercise);
			loading = false;
			hide();
		} else {
			console.error('Please check the provided values and try again');
		}
	}
</script>

{#if showing}
	<Modal on:close={hide} title="Create Exercise">
		<div class="overflow-y-auto">
			<p>Name</p>
			<Input classes="bg-dark-bgdark" bind:value={name} />
			<p class="pt-3">Description</p>
			<textarea
				class="bg-dark-bgdark w-full h-24 rounded focus:outline-none p-2"
				bind:value={description}
			/>
			<div class="flex flex-row justify-between items-center">
				<p>This exercise is part of a series</p>
				<input type="checkbox" bind:checked={previous} />
			</div>
			<p class="mt-3">{previous ? 'Previous Exercise' : 'Template'}</p>
			<Input classes="bg-dark-bgdark" bind:value={template} />

			<p class="mt-3">Requirements</p>
			{#each requirements as requirement}
				<div class="flex flex-row justify-between items-center">
					<p>{requirement}</p>
					<Icon button on:click={() => deleteRequirement(requirement)}><IoIosClose /></Icon>
				</div>
			{/each}
			<p class="text-xs uppercase mt-3">Requirement</p>
			<Input classes="bg-dark-bgdark" bind:value={requirement} />
			<div class="flex flex-row-reverse">
				<Button
					text="Add requirement"
					classes="bg-dark-bgdark hover:bg-blue-700 px-3 mt-1.5"
					on:click={() => addRequirement(requirement)}
				/>
			</div>

			<p class="mt-3">Tests</p>
			{#each Object.keys(tests) as test}
				<div class="flex flex-row justify-between items-center">
					<p>{test}</p>
					<Icon button on:click={() => deleteTest(test)}><IoIosClose /></Icon>
				</div>
			{/each}
			<p class="text-xs uppercase mt-3">Name</p>
			<Input classes="bg-dark-bgdark" bind:value={testName} />
			<p class="text-xs uppercase pt-1">Source</p>
			<textarea
				class="bg-dark-bgdark w-full h-24 rounded focus:outline-none p-2"
				bind:value={testSource}
			/>
			<div class="flex flex-row-reverse">
				<Button
					text="Add test"
					classes="bg-dark-bgdark hover:bg-blue-700 px-3"
					on:click={addTest}
				/>
			</div>

			<p class="mt-3">Overrides</p>
			{#each Object.keys(overrides) as override}
				<div class="flex flex-row justify-between items-center">
					<p>{override}</p>
					<Icon button on:click={() => deleteOverride(override)}><IoIosClose /></Icon>
				</div>
			{/each}
			<p class="text-xs uppercase mt-3">Name</p>
			<Input classes="bg-dark-bgdark" bind:value={overrideName} />
			<p class="text-xs uppercase pt-1">Source</p>
			<textarea class="bg-dark-bgdark w-full h-24" bind:value={overrideSource} />
			<div class="flex flex-row-reverse">
				<Button
					text="Add override"
					classes="bg-dark-bgdark hover:bg-blue-700 px-3"
					on:click={addOverride}
				/>
			</div>

			<Button
				text="Submit"
				classes="bg-blue-700 mt-3 hover:bg-opacity-50"
				on:click={submit}
				{loading}
			/>
		</div>
	</Modal>
{/if}
<div class="w-full px-3">
	<p class="pt-3 pb-1 uppercase text-xs dark:text-dark-text text-light-text">Create Exercise</p>
	<Button text="Create exercise" classes="bg-dark-bglight h-7" on:click={show} />
</div>
