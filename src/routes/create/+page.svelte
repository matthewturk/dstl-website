<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	const narrativeOptions = [
		{
			icon: 'benchmarking.png',
			text: 'A narrative focused on benchmarking performance.'
		},
		{
			icon: 'achievement_narrative.png',
			text: 'A story describing a particular achievement.'
		},
		{
			icon: 'justification.png',
			text: 'Justifying or examining past decisions.'
		}
	];

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
		{ icon: 'motivations-deficits.png', title: 'Address deficits', value: 'deficits', text: 'Where needs are not being met, identifying appropriate ways to address those needs can be based on data-driven understanding.'}
	];
	let need: number = -1;
	let thing: number = -1;
	let narrative: number = -1;
</script>

<div class="w-5/6">
	<div class="p-4" transition:fade={{ duration: 200 }}>
		<ListBox>
			<div class="w-full flex-col grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each narrativeOptions as option, i}
					<ListBoxItem
						class="card p-4 flex justify-center items-center h-full"
						bind:group={narrative}
						name="Item {i}"
						value={i}
					>
					<header class="flex justify-center items-center card-header"><img alt="{option.text}" class="w-10" src="{option.icon}"/></header>
					<section class="pt-2 items-center justify-center text-center">{option.text}</section>
					</ListBoxItem>
				{/each}
			</div>
		</ListBox>
	</div>
</div>

<div class="w-full flex flex-col">
	<div class="w-full flex flex-row">
		<ListBox class="m-4 p-4 w-1/3">
			{#each motivationOptions as option, i}
				<ListBoxItem bind:group={need} name={option.value} value={i}
					><svelte:fragment slot="lead"
						><img width="50px" alt={option.title} src={option.icon} /></svelte:fragment
					>{option.title}</ListBoxItem
				>
			{/each}
		</ListBox>

		{#if need >= 0}
			<div class="m-4 p-4 w-1/2 rounded-lg bg-surface-700">
				{motivationOptions[need]['text']}
			</div>
		{/if}
	</div>
	<div class="w-5/6">
		{#if need == 0}
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
		{/if}
	</div>
</div>
