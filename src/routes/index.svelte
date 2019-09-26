<script context="module">
    let api="/e/e/"
	export async function preload({ params, query }) {
		const that = this || window
		const u = [ `${api}bugs/q?tp=unassigned&uid=3`,
                    `${api}bugs/q?tp=assigned&uid=3`,
                    `${api}bugs/q?tp=monitored&uid=3`,
                    `${api}bugs/q?tp=recent&uid=3`,
                     ]
		const resP= await Promise.all(u.map(x=> that.fetch(x)))
		const dataP= await Promise.all(resP.map(x=> x.json()))
		const res=dataP.reduce((total,data,i)=> {
			if ((total.status == 200) && (resP[i].status == 200)) {
                total["data"+i] = data
			} else {
				total.status=resP[i].status
				total.err=data.message
			}
			return total
		}, ({status: 200}) )
		if (res.status !== 200) {
			that.error(res.status, res.err);
			return;
		}
		return { unassigned: res.data0, assigned: res.data1, monitored: res.data2, recent: res.data3 };
	}
</script>
<script>
    export let assigned
    export let unassigned
    export let monitored
    export let recent
    import BugList from "components/BugList"
</script>

<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Mantis web interfész 0.1</title>
</svelte:head>
<h1>Mantis web interfész</h1>
<BugList limit=7 bugs={assigned} title="Általam kezelt (megoldatlan)"/>
<BugList limit=7 bugs={unassigned} title="Hozzárendeletlen" />
<div style="clear: both;" />
<BugList limit=7 bugs={monitored} title="Általam megfigyelt"/>
<BugList limit=7 bugs={recent} title="Nemrég módosított (30 nap)" />

<div style="clear: both;" />

<p></p>
