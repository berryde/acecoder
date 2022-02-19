<script lang="ts">
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Certificate from 'src/components/certificate/Certificate.svelte';
	import type { Certificate as CertificateType } from 'src/utils/types';
	import Button from 'src/components/common/Button.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCertificate } from 'src/utils/project/project';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import html2canvas from 'html2canvas';

	let certificate: CertificateType;
	onMount(async () => {
		try {
			certificate = await getCertificate($page.params.certificateID);
		} catch (err) {
			window.location.href = '/error/404';
		}
	});

	async function handleDownload() {
		const element = document.getElementById('certificate');
		if (element) {
			const logos = document.getElementsByClassName('logo');
			for (const logo of logos) {
				console.log(logo.parentElement);
			}
			const canvas = await html2canvas(element);

			const link = document.createElement('a');
			link.href = canvas.toDataURL();
			link.download = 'acecoder-certificate.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
</script>

<div class="h-screen bg-brand-background flex flex-col items-center text-brand-text">
	<Navbar showProfile={false} />
	{#if certificate}
		<div class="flex-grow flex flex-col w-full py-10 px-20 max-w-6xl space-y-5 select-none">
			<p class="text-3xl font-bold">Certificate of Achievement</p>
			<p>
				This certificate has been awarded to {certificate.name} to recognise their success in completing
				a project on Acecoder. A project is a complex, multi-stage assignment that evaluates the user's
				front-end development skills.
			</p>
			<div class="flex items-center justify-center">
				<Certificate {certificate} />
			</div>
			<div class="flex justify-end space-x-5">
				<Button text="Share" />
				<Button text="Download" on:click={handleDownload} />
			</div>
		</div>
	{:else}
		<div class="flex flex-grow items-center justify-center">
			<OrbitProgressIndicator />
		</div>
	{/if}
</div>
