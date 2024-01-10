<script lang="ts">
	export let pagename;
    let content;
	async function load(pagename: string) {
		try {
			const post = await import(`../pages/${pagename}.md`);

			return {
				content: post.default,
				meta: post.metadata
			};
		} catch (e) {
			console.log(`Requested ${pagename}.md but could not find.`);
			return { content: '', meta: {} };
		}
	}

	$: load(pagename).then(d => ({ content } = d));
</script>

<svelte:component this={content} />
<slot/>