<script lang="ts">
	import { XCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import TutorialStepper from '../guides/TutorialStepper.svelte';
	import { writable } from 'svelte/store';
	export let visible = writable<boolean>(true);
</script>

{#if $visible}
	<aside class="w-[26rem] shrink-0 h-full overflow-y-auto card p-4">
		<div class="flex items-center justify-between mb-3">
			<h2 class="h4">Quick tour</h2>
			<button type="button" title="Close the tour" on:click={() => ($visible = false)}>
				<Icon src={XCircle} size="24" />
			</button>
		</div>
		<TutorialStepper {visible} />
	</aside>
{/if}
