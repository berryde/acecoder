<script lang="ts">
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Certificate from 'src/components/certificate/Certificate.svelte';
	import IoLogoLinkedin from 'svelte-icons/io/IoLogoLinkedin.svelte';
	import type { Certificate as CertificateType } from '~shared/types';
	import Button from 'src/components/common/Button.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCertificate } from 'src/utils/project/project';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import html2canvas from 'html2canvas';
	import { getName } from 'src/utils/auth/auth';
	import { auth } from 'src/utils/firebase';

	/**
	 * Whether the page is loading
	 */
	let loading = true;

	/**
	 * The certificate to display
	 */
	let certificate: CertificateType;

	/**
	 * The name of the user received this certificate
	 */
	let name: string;

	onMount(async () => {
		try {
			certificate = await getCertificate($page.params.certificateID);
			name = await getName(certificate.uid, true);
			loading = false;
		} catch (err) {
			console.error(err);
			//window.location.href = '/error/404';
		}
	});

	/**
	 * Download the certificate
	 */
	async function handleDownload() {
		const element = document.getElementById('certificate');
		if (element) {
			const canvas = await html2canvas(element);
			const link = document.createElement('a');
			link.href = canvas.toDataURL();
			link.download = 'acecoder-certificate.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	/**
	 * Share the certificate to linkedin
	 */
	function handleShare() {
		const organisationID = 79117149;
		const date = certificate.issued.toDate();
		const url = encodeURIComponent(window.location.href);

		window.location.href = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${
			certificate.projectID
		}&organizationId=${organisationID}&issueYear=${date.getFullYear()}&issueMonth=${date.getMonth()}&certUrl=${url}&certId=${
			$page.params.certificateID
		}`;
	}
</script>

<svelte:head>
	<title>Certificate - Acecoder</title>
</svelte:head>

{#if loading}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	<div class="h-screen bg-brand-background flex flex-col items-center text-brand-text">
		<Navbar showProfile={false} />
		{#if certificate}
			<div class="flex-grow flex flex-col w-full py-10 px-20 max-w-6xl space-y-5 select-none">
				<p class="text-3xl font-bold">Certificate of Achievement</p>
				<p>
					This certificate has been awarded to {name} to recognise their success in completing a project
					on Acecoder. A project is a complex, multi-stage assignment that evaluates the user's front-end
					development skills.
				</p>
				<div class="flex items-center justify-center">
					<Certificate {certificate} {name} />
				</div>
				<div class="flex justify-end space-x-5">
					{#if auth.currentUser && certificate.uid == auth.currentUser.uid}
						<Button icon={true} text="Add to profile" on:click={handleShare}>
							<IoLogoLinkedin />
						</Button>
					{/if}
					<Button text="Download" on:click={handleDownload} />
				</div>
			</div>
		{:else}
			<div class="flex flex-grow items-center justify-center">
				<OrbitProgressIndicator />
			</div>
		{/if}
	</div>
{/if}
