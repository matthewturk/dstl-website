<script lang="ts" context="module">
	import { PresentationChartLine } from '@steeze-ui/heroicons';
	export const icon = PresentationChartLine;
</script>
<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useHandleConnections,
		useNodesData
	} from '@xyflow/svelte';
	import { Line, Scatter, Bar } from 'svelte-chartjs';
	import * as aq from 'arquero';
	//import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
	import 'chart.js/auto';
	import type { ChartData, ChartDataset } from 'chart.js';
	import NodeWrapper from './NodeWrapper.svelte';
    type $$Props = NodeProps;
    export let id: $$Props['id']; id;
    export let data: $$Props['data']; data;
    export let dragHandle: $$Props['dragHandle'] = undefined; dragHandle;
    export let type: $$Props['type']  = undefined; type;
    export let selected: $$Props['selected'] = undefined; selected;
    export let isConnectable: $$Props['isConnectable'] = undefined; isConnectable;
    export let zIndex: $$Props['zIndex'] = undefined; zIndex;
    export let width: $$Props['width'] = undefined; width;
    export let height: $$Props['height'] = undefined; height;
    export let dragging: $$Props['dragging']; dragging;
    export let targetPosition: $$Props['targetPosition'] = undefined; targetPosition;
    export let sourcePosition: $$Props['sourcePosition'] = undefined; sourcePosition;
	let xColumn = '';
	let yColumn = '';
	let plotType = 'line';

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

	$: { if(table) {
		columns = table.columnNames() || [];
		values = table.objects();
	}}

	$: {
		dataToPlot = {
			labels: values.map((e) => e[xColumn]),
			datasets: [{ label: yColumn, data: values.map((e) => e[yColumn]) }]
		};
	}
</script>

<NodeWrapper {id} {icon} label="Graph" resizable={true}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div class="flex flex-col">
		<div class="p-2 m-2">
			<label for="plotType">Plot Type</label>
			<select id="plotType" bind:value={plotType}>
				<option value="line">Line</option>
				<option value="scatter">Scatter</option>
				<option value="bar">Bar</option>
			</select>
		</div>
		{#if values.length > 0}
			<div class="p-2 m-2">
				<label for="xcol">Select X-axis Column: </label>
				<select id="xcol" bind:value={xColumn}>
					{#each columns as field}
						<option value={field}>{field}</option>
					{/each}
				</select>
			</div>

			<div class="p-2 m-2">
				<label for="ycol">Select Y-axis Column: </label>
				<select id="ycol" bind:value={yColumn}>
					{#each columns as field}
						<option value={field}>{field}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	{#if plotType == 'line'}
		<Line class="w-5/6 bg-white h-32" options={{ responsive: true }} data={dataToPlot} />
	{:else if plotType == 'scatter'}
		<Scatter class="w-5/6 bg-white h-32" options={{ responsive: true }} data={dataToPlot} />
	{:else if plotType == 'bar'}
		<Bar class="w-5/6 bg-white h-32" options={{ responsive: true }} data={dataToPlot} />
	{:else}
		<p>Plot type not supported</p>
	{/if}
</NodeWrapper>
