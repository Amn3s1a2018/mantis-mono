<script>
	import Nav from '../components/Nav.svelte';
	export let segment;
</script>

<style lang="scss">

	main {
		position: relative;
		background-color: white;
		padding: 0;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
<Nav {segment}/>
<main>
	<slot></slot>
</main>

