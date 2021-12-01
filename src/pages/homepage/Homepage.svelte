<script>
	import { goto } from '$app/navigation';
	import { isStandalone } from 'src/utils/exercise/exercise';
	import { auth } from 'src/utils/auth/auth';
</script>

<div class="h-screen w-screen bg-dark-bgdark flex items-center justify-center">
	<div class="w-1/3 text-dark-text space-y-5">
		<h1 class="font-bold text-2xl">
			Welcome back, {$auth.displayName.split(' ')[0]}
		</h1>
		<p>
			Choose a function from the options below. Use the <strong>editor</strong> to create and share
			your own projects in the browser. The <strong>demo project</strong> should give you an idea of
			the future of the application, allowing you to complete and submit an exercsise.
		</p>
		<div class="flex flex-row space-x-5">
			<div
				class="flex-grow py-5 bg-dark-bglight rounded uppercase font-bold text-sm flex items-center justify-center hover:bg-blue-700 transition-all"
				on:click={() => {
					isStandalone.set(true);
					goto('editor');
				}}
			>
				<p>Editor</p>
			</div>
			<div
				class="flex-grow py-7 bg-dark-bglight rounded uppercase font-bold text-sm flex items-center justify-center hover:bg-blue-700 transition-all"
				on:click={() => {
					isStandalone.set(false);
					// goto('exercise/9A5WFx5Ki8Rlni9FmkJf');

					goto('exercise/vteMX6qHVEy6uku8sS3Z');
				}}
			>
				<p>Demo project</p>
			</div>
		</div>
		<p>
			Feel free to leave your thoughts, such as features you would love to see or bugs you have
			spotted, within the sidebar’s feedback section. Thank you for checking out the application!
		</p>
	</div>
</div>
