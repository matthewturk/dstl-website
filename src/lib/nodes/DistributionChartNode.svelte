<script lang="ts" context="module">
	import { ChartBarSquare } from '@steeze-ui/heroicons';
	export const icon = ChartBarSquare;
</script>

<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useHandleConnections,
		useNodesData
	} from '@xyflow/svelte';
	import { Bar } from 'svelte-chartjs';
	import * as aq from 'arquero';
	//import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
	import 'chart.js/auto';
	import type { ChartData, ChartDataset } from 'chart.js';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	id;
	export let data: $$Props['data'];
	data;
	export let dragHandle: $$Props['dragHandle'] = undefined;
	dragHandle;
	export let type: $$Props['type'] = undefined;
	type;
	export let selected: $$Props['selected'] = undefined;
	selected;
	export let isConnectable: $$Props['isConnectable'] = undefined;
	isConnectable;
	export let zIndex: $$Props['zIndex'] = undefined;
	zIndex;
	export let width: $$Props['width'] = undefined;
	width;
	export let height: $$Props['height'] = undefined;
	height;
	export let dragging: $$Props['dragging'];
	dragging;
	export let targetPosition: $$Props['targetPosition'] = undefined;
	targetPosition;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	sourcePosition;
	let numColumns: string | number = 'auto';
	let distColumn: string;

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	let table: aq.internal.ColumnTable;
	let columns: string[] = [];
	let values: { [key: string]: any }[] = [];
	let dataToPlot: ChartData<any, number[]> = { labels: [], datasets: [] };

	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;

	$: {
		if (table) {
			columns = table.columnNames() || [];
			values = table.objects();
		}
	}

	$: {
		if (table && table.columnNames().includes(distColumn)) {
			// This was in the recipes for arquero
			let binnedTable = table
				.groupby({
					b0: aq.bin(distColumn, { maxbins: 10 }),
					b1: aq.bin(distColumn, { maxbins: 10, offset: 1 })
				})
				.count()
				.impute(
					{ count: () => 0 },
					{
						expand: {
							b0: (d) => aq.op.sequence(...aq.op.bins(d.b0, 10)),
						}
					} // include rows for all bin values
				)
				.orderby('b0');
			let bins = binnedTable.objects();
			console.log(bins);
			console.log(binnedTable);
			dataToPlot = {
				labels: bins.map((bin) => `${bin.b0} - ${bin.b1}`),
				datasets: [{ data: bins.map((bin) => bin.count) }]
			};
		}
	}
</script>

<NodeWrapper {icon} label="Distribution" resizable={true}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div class="flex flex-col">
		{#if values.length > 0}
			<div class="p-2 m-2">
				<label for="column">Select Column:</label>
				<select id="column" bind:value={distColumn}>
					{#each columns as field}
						<option value={field}>{field}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<Bar class="w-5/6 bg-white h-32" options={{ responsive: true }} data={dataToPlot} />
</NodeWrapper>
