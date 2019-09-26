<script context="module">
	let api="/e/e/"
	export async function preload({ params, query }) {
		const that = this || window
		const u = [ `${api}bugs/${params.id}`,
			    `${api}bug/${params.id}/notes` ]
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
		return { bug: res.data0[0], notes: res.data1 };
	}

	function printTime(n) {
		return n ? `${n/60 ^ 0}:${(n%60).toString().padStart(2,'0')}` : ""
	}
</script>

<script>
	export let bug
	export let notes
	let newnote=""
	let newtimetrack="0"
	async function handleClick(e) {
		//fixme
		const res= await fetch(`${api}new/bugnote`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({bug: bug.id, reporter: 3/*FIXME*/, timeTracking: newtimetrack, note: newnote })
		})
		if (res.status!=200) {
			console.error(res.status, res.err)
		}
		newnote=""
		newtimetrack="0";
		({bug,notes} = await preload({params: {id: bug.id}}));
		document.getElementById("newnote").focus();
	}
	let handleX= async id => () => {
		//const res= await fetch(`${api}DELETE_NOTE/FIXME${id}`)
		notes = notes.filter( n => n.id!=id )
		document.getElementById("newnote").focus();
	}
</script>

<style>
span.unfit a {
	text-decoration: line-through;
}
textarea { width:100%; height: 70px; }
.xbtn { width: auto; background-color: inherit; border-radius: .4em; }
</style>

<svelte:head>
	<title>{bug.project}</title>
</svelte:head>



<div class='content'>
	<ul class="rows">
    <div class=left>
		<h1>{bug.project}</h1>
		{bug.summary}
	</div>
	<div class=right>
		<textarea bind:value={newnote} id="newnote" placeholder="Új komment beküldése"/>
		<input size=6 bind:value={newtimetrack} /><button on:click={handleClick}>Add note</button>
	</div>
	{#each notes as n(n.id)}
	<li class="row status-50-color"><span id="c{n.id}" />
		<div class="nowrap width-13 idbox">
		<button class="right xbtn" on:click={handleX(n.id)}>X</button>
		<span class="{n.user_enabled > 0 ? "fit" : "unfit" }">👤 <a href="/users/{n.username}">{n.username}</a></span><br/>
		<span>🔗 <a href="/bugs/{bug.id}#c{n.id}">{n.id}</a></span><br/>
		<span>🕖 {printTime(n.time_tracking)}</span>
   	    </div>
		{#if n.note}
		<p>{n.note}</p>
		{/if}
		<div style="clear: both"/>
	</li>

	{/each}
	<div style="clear: both"/>
	</ul>
</div>
