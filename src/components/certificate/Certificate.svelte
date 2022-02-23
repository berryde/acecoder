<script lang="ts">
	import { page } from '$app/stores';
	import Logo from 'src/components/navbar/Logo.svelte';
	import { getMonthString } from 'src/utils/general';
	import type { Certificate } from 'src/utils/types';

	export let certificate: Certificate;
	export let name: string;

	function getDateString() {
		const date: Date = certificate.issued.toDate();
		return `${getMonthString(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;
	}
</script>

<div class="certificate max-w-6xl w-full text-brand-accent inter p-10 space-y-32" id="certificate">
	<div>
		<Logo size="large" />
		<p class="inter text-2xl tracking-tight">Certificate of Achievement</p>
	</div>
	<div class="flex flex-col items-center space-y-2">
		<p class="text-sm">This is to certify that</p>
		<p class="text-3xl font-bold pb-2">{name}</p>
		<p class="text-sm">has successfully completed the required assessments for the project</p>
		<p class="text-xl font-bold">{certificate.project}</p>
	</div>

	<div class="flex items-center w-full text-xs space-x-5">
		<div>
			<p>Verified Certificate</p>
			<p class="opacity-80">Issued {getDateString()}</p>
		</div>
		<div>
			<p>Valid ID</p>
			<p class="opacity-80">{$page.params.certificateID}</p>
		</div>
	</div>
</div>

<style>
	.inter {
		font-family: 'Inter', sans-serif;
	}
	.certificate {
		background-image: url('/images/cert_bg.png');
	}
</style>
