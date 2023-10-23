<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	const step1Options = [
		{
			icon: 'motivations-needsassess.png',
			text: 'Understand the real needs of their communities',
			value: 'needsassess'
		},
		{
			icon: 'motivations-meetneeds.png',
			text: 'Serve the needs of their communities',
			value: 'meetneeds'
		},
		{ icon: 'motivations-equitable.png', text: 'Keep up with other libraries', value: 'equitable' },
		{ icon: 'motivations-strength.png', text: 'Build on existing strengths', value: 'strengths' },
		{ icon: 'motivations-deficits.png', text: 'Address deficits', value: 'deficits' }
	];
	let need: number = -1;
	let thing: number = -1;
</script>

<div class="w-full flex flex-col">
	<div class="w-full flex flex-row">
		<ListBox class="m-4 p-4 w-1/3">
			{#each step1Options as option, i}
				<ListBoxItem bind:group={need} name={option.value} value={i}
					><svelte:fragment slot="lead"
						><img width="50px" alt={option.text} src={option.icon} /></svelte:fragment
					>{option.text}</ListBoxItem
				>
			{/each}
		</ListBox>

		{#if need >= 0}
			<div class="m-4 p-4 w-1/2 rounded-lg bg-surface-700">
				{step1Options[need]['text']}
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
