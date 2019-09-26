<script>
    export let bugs
    export let limit=0
    export let title="Support ügyek"
   	let url="http://bugs.tron.hu/"

	let filter=""
	function runFilter(f,l) {
        let res= bugs.filter(x=> (x.project+x.summary).toLowerCase().search(f.toLowerCase()) !== -1)
        if(l) return res.slice(0,l)
        return res
	}

	function handleFilter(e) {
		if (runFilter(e.target.value,limit).length>0) {
			filter=e.target.value;
		} else {
			e.target.value=filter
		}
	}

	$: filtered = runFilter(filter,limit)
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
    }
    div.h {
        background: #5090C1;
        margin: -1em;
        padding: 1em;
        border-radius: 0.9em 0.9em 0 0;
    }
</style>

<ul class="rows left">
    <div class=h><span>{title}</span><input style="float: right;"  on:input={handleFilter} value={filter} placeholder="Keresés"/></div>
	{#each filtered as b(b.id)}
		<li class="row status-{b.status}-color" >
			<div class="nowrap width-13 idbox">
			    <a href="{url}view.php?id={b.id}">{b.id}</a><br/>
   	    	    <a class="edit" href="{url}bug_update_page.php?bug_id={b.id}"><i class="fa fa-pencil bigger-130 padding-2 grey" alt="Szerkesztés" title="Szerkesztés"></i></a>
   	    	</div>
			<div>
			    <span>[{b.project}]</span> <span><a rel=prefetch href="/bugs/{b.id}">{b.summary}</a></span><br>
   	    	    <span class="small">{b.category}</span> - <span class="small">{b.updated}</span>
   	    	</div>
			<!--	<a rel='prefetch' href='bugs/{post.id}'>{post.project}</a>< -->
		</li>
	{/each}
</ul>
