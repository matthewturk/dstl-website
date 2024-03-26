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
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<svelte:fragment slot="sidebarLeft">
	</svelte:fragment>
	<slot/>
</AppShell>
