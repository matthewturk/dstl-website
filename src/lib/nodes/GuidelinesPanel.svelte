<script lang="ts">
	import { Panel } from '@xyflow/svelte';
	import { XCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import TutorialStepper from './TutorialStepper.svelte';
	import { writable } from 'svelte/store';
	let selected: string = 'howto';
	export let visible = writable<boolean>(true);
</script>

{#if $visible}
	<Panel position="top-left" class="w-1/4 h-8">
		<div class="absolute right-0 top-5">
			<button on:click={() => ($visible = false)}>
				<Icon src={XCircle} size="24" />
			</button>
		</div>
		<div class="w-full items-center text-token card p-4 m-4 flex flex-row">
			<span class="m-2">Help me describe...</span>
			<span class="m-2"
				><select class="select" bind:value={selected}>
					<option value="howto">How to Use This</option>
					<option value="achievement">Achievement</option>
					<option value="benchmarking">Benchmarking</option>
					<option value="justification">Justification</option>
				</select></span
			>
		</div>
		{#if selected == 'howto'}
			<TutorialStepper />
		{:else if selected=="achievement"}
		{:else if selected=="benchmarking"}
		{:else if selected=="justification"}
		{/if}
		
	</Panel>
{/if}
