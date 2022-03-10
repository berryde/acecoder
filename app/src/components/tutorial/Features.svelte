<script>
	import Icon from '../common/Icon.svelte';
	import DiReact from 'svelte-icons/di/DiReact.svelte';
	import WiStrongWind from 'svelte-icons/wi/WiStrongWind.svelte';
	import IoIosTime from 'svelte-icons/io/IoIosTime.svelte';
	import IoIosBug from 'svelte-icons/io/IoIosBug.svelte';
	import { language } from 'src/utils/exercise/exercise';
	import { capitalise } from '~shared/constants';
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
		TailwindCSS is supported by the application to make styling a quick and easy process. You can
		find a list of classes at the <a
			class="text-brand-primary"
			href="https://tailwindcss.com/docs/utility-first">official documentation</a
		>.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<IoIosTime />
	</Icon>
	<p class="flex-grow">
		Submissions are run on our secure server. Please wait up to 30 seconds for your results.
	</p>
</div>
<div class="flex items-center space-x-5">
	<Icon card={true}>
		<IoIosBug />
	</Icon>
	<p class="flex-grow">
		You can use your browser's built-in console to view log messages and debug errors.
	</p>
</div>
