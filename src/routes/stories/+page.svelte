<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Vega, View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	let visible: boolean = true;

	let data = {
		table: [
			{ category: 'A', amount: 28, cat2: 'H' },
			{ category: 'B', amount: 55, cat2: 'G'},
			{ category: 'C', amount: 43, cat2: 'F'},
			{ category: 'D', amount: 91, cat2: 'E'},
			{ category: 'E', amount: 81, cat2: 'D'},
			{ category: 'F', amount: 53, cat2: 'C'},
			{ category: 'G', amount: 19, cat2: 'B'},
			{ category: 'H', amount: 87, cat2: 'A'}
		]
	};
	let spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'A simple bar chart with embedded data.',
		data: {
			name: 'table'
		},
		mark: 'bar',
		encoding: {
			x: { field: 'category', type: 'nominal' },
			y: { field: 'amount', type: 'quantitative' }
		}
	};

    function updateSpec(): void {
        console.log("Hi");
        spec.title = "new title";
        data.table[0].amount = 50;
        data = {table: []};
        console.log(myView);
    }
    let myView: View;
</script>

{#if visible}
	<aside class="alert variant-filled-error" transition:fade={{ duration: 200 }}>
		<!-- Icon -->
		<div>(icon)</div>
		<!-- Message -->
		<div class="alert-message">
			<h3 class="h3">(title)</h3>
			<p>You don't have any stories yet.</p>
		</div>
		<!-- Actions -->
		<div class="alert-actions">(buttons)</div>
	</aside>
{/if}

<VegaLite bind:view={myView} bind:data={data} bind:spec={spec}/>
<button on:click={updateSpec}>click me</button>