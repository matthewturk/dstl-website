<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Table, type TableSource, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { Vega, View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	let visible: boolean = true;

	let refreshCount: number = 0;
	let table = [
		{ library: 'A', op_income: 644506, building_condition: 'Average' },
		{ library: 'B', op_income: 112855, building_condition: 'Fair' },
		{ library: 'C', op_income: 58461, building_condition: 'Poor' },
		{ library: 'D', op_income: 33194, building_condition: 'Average' },
		{ library: 'E', op_income: 39817, building_condition: 'Average' },
		{ library: 'F', op_income: 40841, building_condition: 'Good' },
		{ library: 'G', op_income: 49556, building_condition: 'Average' },
		{ library: 'H', op_income: 55531, building_condition: 'Average' }
	];
	$: data = { table };
	let spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'A simple bar chart with embedded data.',
		height: 250,
		width: 250,
		data: {
			name: 'table'
		},
		mark: 'bar',
		params: [{ name: 'select', select: { type: 'point', encodings: ['x'] } }],
		encoding: {
			x: { field: 'library', type: 'nominal' },
			y: { field: 'op_income', type: 'quantitative' },
			fillOpacity: {
				condition: { param: 'select', value: 1 },
				value: 0.3
			}
		}
	};

	let selected;

	function handleSelection(...args: any[]) {
		console.log(args);
		if (args[1].category !== undefined) {
			selected = `selected column(s): ${args[1].category}`;
		} else {
			selected = '';
		}
	}

	function updateSpec(): void {
		table[0].op_income *= 1.01;
		refreshCount += 1;
		spec = { ...spec, title: 'new title', usermeta: { refreshCount } };
		console.log(myView);
		console.log(myView.container());
		myView.resize();
	}
	let myView: View;

	let tableSimple: TableSource;
	$: tableSimple = {
		// A list of heading labels.
		head: ['Library', 'Operational Income', 'Building Condition'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(table, ['library', 'op_income', 'building_condition']),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		// meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
		// Optional: A list of footer labels.
		foot: ['Total', '', '<code class="code">5</code>']
	};
</script>

<div class="flex flex-row">
	<div class="min-fit-content w-1/2">
		<VegaLite
			bind:view={myView}
			bind:data
			bind:spec
			signalListeners={{ select: handleSelection }}
		/>
		<button type="button" class="btn variant-filled-primary" on:click={updateSpec}>click me</button>
	</div>

	<div class="w-1/2">
		<Table source={tableSimple} />
	</div>
</div>
