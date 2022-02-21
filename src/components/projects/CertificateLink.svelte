<script lang="ts">
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';

	export let certificateID: string;

	function openCertificate() {
		window.location.href = `/certificate/${certificateID}`;
	}
</script>

<Card title="Certificate of Completion">
	<p>
		You have unlocked a unique certificate for completing this project. This certificate has been
		added to your profile and can be viewed at any time.
	</p>
	<div class="flex justify-end">
		<Button text="View certificate" link={true} on:click={openCertificate} />
	</div>
</Card>
