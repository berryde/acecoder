<script lang="ts">
	import Button from 'src/components/common/Button.svelte';
	import Logo from 'src/components/navbar/Logo.svelte';
</script>

<svelte:head>
	<title>Acecoder</title>
</svelte:head>

<div class="flex flex-col items-center text-brand-text bg-brand-background relative">
	<div class="w-full hero flex flex-col items-center py-44">
		<div class="flex flex-col items-center w-80 space-y-5 ">
			<Logo variant="light" link={false} size="large" />
			<p class="text-center">
				Build, share and learn with interactive web development projects, from the comfort of your
				browser.
			</p>
			<div class="flex space-x-5">
				<Button
					text="Sign up"
					on:click={() => {
						window.location.href = '/register';
					}}
				/>
				<Button
					text="Sign in"
					outline={true}
					on:click={() => {
						window.location.href = '/login';
					}}
				/>
			</div>
		</div>
	</div>

	<div class="max-w-3xl w-full p-20 flex flex-col items-center space-y-10 bg-brand-background">
		<p class="font-bold text-2xl">What is Acecoder?</p>
		<div>
			<p>
				Acecoder is a platform for completing front-end development projects tightly coupled to
				real-world scenarios.
			</p>
			<br />
			<p>
				Pick from a choice of JavaScript framworks and use the in-browser editor to complete each
				exercise within the project. Submissions are verified by the Acecoder server.
			</p>
		</div>
		<img src="/images/landing/screenshots.png" alt="screenshots of the editor" />
		<hr class="border-brand-accent w-10" />
		<p class="font-bold text-2xl">Why complete projects?</p>
		<div>
			<p>
				After completing a project, you will unlock a unique certificate that can be added to your
				LinkedIn profile and shared with your profiessional network to demonstrate your skills.
			</p>
			<br />
			<p>
				You can also unlock achievements for reaching various milestones within the application.
			</p>
		</div>
		<img src="/images/landing/certificate.png" alt="example certificate" />
		<p class="font-bold text-2xl">Who made Acecoder?</p>
		<div>
			<p>
				Acecoder is being developed by Daniel Berry, a student at the University of Southampton, as
				an assignment for his computer science studies.
			</p>
			<br />
			<p>
				The application was built with the hope of one day being used in the hiring process for
				front end software engineers, to create an environment that is grounded in reality and
				assesses relevant skills.
			</p>
			<br />
			<p>
				If you want to share your thoughts or find out more, please <a
					class="text-brand-primary"
					href="mail:deb1g19@soton.ac.uk">get in touch</a
				>.
			</p>
		</div>
	</div>
</div>

<style>
	.hero {
		background-image: url('/images/landing/hero-bg.png');
		background-position-x: center;
		background-position-y: bottom;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
