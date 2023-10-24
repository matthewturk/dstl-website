<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Vega, View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	let visible: boolean = true;

	let data = {
		table: [
			{ library: 'A', op_income: 644506, building_condition: 'Average' },
			{ library: 'B', op_income: 112855, building_condition: 'Fair'},
			{ library: 'C', op_income: 58461, building_condition: 'Poor'},
			{ library: 'D', op_income: 33194, building_condition: 'Average'},
			{ library: 'E', op_income: 39817, building_condition: 'Average'},
			{ library: 'F', op_income: 40841, building_condition: 'Good'},
			{ library: 'G', op_income: 49556, building_condition: 'Average'},
			{ library: 'H', op_income: 55531, building_condition: 'Average'}
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
			x: { field: 'library', type: 'nominal' },
			y: { field: 'op_income', type: 'quantitative' }
		}
	};

    function updateSpec(): void {
        console.log("Hi");
        spec.title = "new title";
        data.table[0].op_income = 129340;
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
