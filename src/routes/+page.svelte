<script>
	import { Avatar } from '@skeletonlabs/skeleton';
</script>
<div class="container mx-auto p-8 space-y-8">

<Avatar initials="MT" />
	<h1 class="h1">Welcome to <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone">DSTL</span>!</h1>
	<p>This is the DSTL website.</p>
	<p>
		Turn your library's data into clear charts and stories. No coding needed, and your data never
		leaves your computer.
	</p>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<a href="/datasets" class="card card-hover block p-6 space-y-2">
			<h2 class="h3">Explore your data</h2>
			<p>Upload a spreadsheet (CSV) and build charts step by step. A short tutorial will guide you.</p>
			<span class="btn variant-filled-primary">Start exploring</span>
		</a>
		<a href="/create" class="card card-hover block p-6 space-y-2">
			<h2 class="h3">Create a data story</h2>
			<p>Not sure where to start? Pick the kind of story you want to tell.</p>
			<span class="btn variant-filled-secondary">Create a story</span>
		</a>
	</div>
	<section>
		<a class="btn variant-filled-primary" href="https://kit.svelte.dev/">SvelteKit</a>
		<a class="btn variant-filled-secondary" href="https://tailwindcss.com/">Tailwind</a>
		<a class="btn variant-filled-tertiary" href="https://github.com/">GitHub</a>
	</section>
</div>