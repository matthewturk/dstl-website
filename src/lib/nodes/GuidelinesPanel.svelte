<script lang="ts">
	import { XCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import TutorialStepper from '../guides/TutorialStepper.svelte';
	import NarrativeGuide from '../guides/NarrativeGuide.svelte';
	import { writable } from 'svelte/store';
	export let visible = writable<boolean>(true);

	// "Help me describe..." is hidden for now. Set this to true to bring it back.
	const SHOW_HELP_ME_DESCRIBE = false;
	let selected: string = 'howto';
</script>

{#if $visible}
	<aside class="w-[26rem] shrink-0 h-full overflow-y-auto card p-4">
		<div class="flex items-center justify-between mb-3">
			<h2 class="h4">Quick tour</h2>
			<button type="button" title="Close the tour" on:click={() => ($visible = false)}>
				<Icon src={XCircle} size="24" />
			</button>
		</div>
		{#if SHOW_HELP_ME_DESCRIBE}
			<div class="w-full items-center text-token card p-4 mb-3 flex flex-row">
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
		{/if}
		{#if !SHOW_HELP_ME_DESCRIBE || selected == 'howto'}
			<TutorialStepper {visible} />
		{:else}
			<NarrativeGuide bind:storyType={selected} />
		{/if}
	</aside>
{/if}
