<script>
	import Icon from '../common/Icon.svelte';
	import DiReact from 'svelte-icons/di/DiReact.svelte';
	import WiStrongWind from 'svelte-icons/wi/WiStrongWind.svelte';
	import IoIosTime from 'svelte-icons/io/IoIosTime.svelte';
	import { language } from 'src/utils/exercise/exercise';
	import { capitalise } from 'src/utils/general';
</script>

<p class="text-lg mb-2">Completing exercises</p>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<DiReact />
	</Icon>
	<p class="flex-grow">
		Exercises can be completed in either Svelte or React. You chose to complete this exercise in
		{capitalise($language)}.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<WiStrongWind />
	</Icon>
	<p class="flex-grow">
		TailwindCSS is fully supported by the application to make styling a quick and easy process. You
		can find a list of classes at the official documentation.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<IoIosTime />
	</Icon>
	<p class="flex-grow">
		Your submissions are run on our secure test server. Please wait up to 30 seconds for your
		results.
	</p>
</div>
