<script lang="ts">
	/**
	 * Whether the user is currently hovering over this component.
	 */
	let hovering = false;

	/**
	 * Called when the user starts hovering over this component.
	 */
	function enter() {
		hovering = true;
	}

	/**
	 * Called when the user stops hovering over this component.
	 */
	function leave() {
		hovering = false;
	}

	export let classes = '';
</script>

<div on:mouseenter={enter} on:mouseleave={leave} class={classes}>
	<slot {hovering} />
</div>
