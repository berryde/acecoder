<script lang="ts">
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';

	export let certificateID: string;
</script>

<Card title="Certificate of Completion">
	<p>
		You have unlocked a unique certificate for completing this project. This certificate has been
		added to your profile and can be viewed at any time.
	</p>
	<div class="flex justify-end">
		<a href={`/certificate/${certificateID}`}>
			<Button text="View certificate" link={true} />
		</a>
	</div>
</Card>
