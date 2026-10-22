<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4" slotPageContent="p-4" scrollbarGutter="stable">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="text-xl font-bold">DSTL</a>
			</svelte:fragment>
			<nav class="flex gap-2">
				<a class="btn btn-sm variant-ghost-surface" href="/datasets">Explore Your Data</a>
				<a class="btn btn-sm variant-ghost-surface" href="/create">Create a Story</a>
				<a class="btn btn-sm variant-ghost-surface" href="/stories">Examples</a>
				<a class="btn btn-sm variant-ghost-surface" href="/about">About</a>
			</nav>
	</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<svelte:fragment slot="sidebarLeft">
	</svelte:fragment>
	<slot/>
</AppShell>
