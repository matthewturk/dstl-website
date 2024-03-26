<script lang="ts">
	import MarkdownContent from '$lib/MarkdownContent.svelte';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	export let storyType = 'achievement';

	const narrativeOptions: { [key: string]: { icon: string; title: string; text: string } } = {
		achievement: {
			icon: 'achievement_narrative.png',
			title: 'Achievement',
			text: 'A story describing a particular achievement.'
		},
		benchmarking: {
			icon: 'benchmarking.png',
			title: 'Benchmarking',
			text: 'A narrative focused on benchmarking performance.'
		},
		justification: {
			icon: 'justification.png',
			title: 'Justification',
			text: 'Justifying or examining past decisions.'
		}
	};

	$: option = narrativeOptions[storyType];

	const motivationOptions = [
		{
			icon: 'motivations-needsassess.png',
			title: 'Understand the real needs of their communities',
			value: 'needsassess',
			text: 'Data can provide insights beyond anecodtal experiences or intuition.'
		},
		{
			icon: 'motivations-meetneeds.png',
			title: 'Serve the needs of their communities',
			value: 'meetneeds',
			text: 'Focusing on the needs of the members of the community, how can those needs be identified and met?'
		},
		{
			icon: 'motivations-strength.png',
			title: 'Build on existing strengths',
			value: 'strengths',
			text: 'Identifying those areas the library \
				that are already performing well, but that could be augmented or otherwise supported.'
		},
		{
			icon: 'motivations-deficits.png',
			title: 'Address deficits',
			value: 'deficits',
			text: 'Where needs are not being met, identifying appropriate ways to address those needs can be based on data-driven understanding.'
		}
	];
	let need: number = -1;
	let thing: number = -1;
	let narrative: number = -1;
</script>

<div class="w-full text-token card p-4 m-4 flex flex-row">
	<div class="w-1/4">
		<img alt={option.text} class="h-12" src={option.icon} />
	</div>
	<div class="w-3/4">
		<h3>{option.title}</h3>
		{option.text}
	</div>
</div>
	<hr />
	<div class="w-full flex-1 grid grid-cols-3">
		<ListBox class="m-4 p-4 col-span-1">
			{#each motivationOptions as option, i}
				<ListBoxItem bind:group={need} name={option.value} value={i} class="variant-filled-secondary">
					<svelte:fragment slot="lead"
						><img width="50px" alt={option.title} src={option.icon} /></svelte:fragment
					>{option.title}</ListBoxItem
				>
			{/each}
		</ListBox>
		{#if need >= 0}
			<div class="m-4 p-4 col-span-2 rounded-lg bg-surface-600">
				{motivationOptions[need]['text']}
			</div>
		{/if}
	</div>
	<hr />
	{#if need == 0}
		<div class="w-full flex-1 grid-grid-cols-3">
			<div class="p-4" transition:fade={{ duration: 200 }}>
				<ListBox>
					<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each Array.from({ length: 8 }) as _, i}
							<ListBoxItem
								class="card p-4 flex justify-center items-center"
								bind:group={thing}
								name="Item {i}"
								value={i}
							>
								Item {i}
								lorem ipsum<br />
								just lots of stuff<br />
								fjweihvjrio
							</ListBoxItem>
						{/each}
					</div>
				</ListBox>
			</div>
		</div>
	{/if}
