<script lang="ts">
	export let pagename;
	let content;
	async function load(pagename: string) {
		try {
			const post = await import(`../pages/${pagename}.md`);

			return {
				content: post.default,
				meta: post.metadata,
				class: 'markdown-body'
			};
		} catch (e) {
			console.log(`Requested ${pagename}.md but could not find.`);
			return { content: '', meta: {} };
		}
	}

	$: load(pagename).then((d) => ({ content } = d));
</script>

<div class="flex flex-col h-full w-full p-0 m-0">
	<div class="flex-none m-2 p-2">
		<svelte:component this={content} />
	</div>
	<div class="flex-auto m-2 p-2">
		<slot />
	</div>
</div>
