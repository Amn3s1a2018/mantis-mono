<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`/e/e/bugs/6390,10145,6391,6392,10168,10309,6393,6394,6395,6396,9134,6398,6397,6390,6399,6401,6403,6404,9133`)
		.then(r => r.json()).then(bugs => {
			return { bugs };
		});
	}
</script>

<script>
    export let bugs
    import BugList from "components/BugList.svelte"
</script>

<svelte:head>
	<title>Nagyon különleges ügyek</title>
</svelte:head>

<h1>Nagyon különleges ügyek</h1>

<BugList bugs={bugs} />
