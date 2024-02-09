<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useSvelteFlow,
		NodeResizer,
		useHandleConnections,
		useNodesData
	} from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { Line, Scatter, Bar } from 'svelte-chartjs';
	//import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
	import 'chart.js/auto';
	import type { ChartData, ChartDataset } from 'chart.js';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let isConnectable: $$Props['isConnectable'];
	let files: FileList;
	let xColumn = '';
	let yColumn = '';
	let plotType = 'line';

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	let columns: string[] = [];
	let values: { [key: string]: any }[] = [];
	let dataToPlot: ChartData<any, number[]> = { labels: [], datasets: [] };

	$: nodeData = useNodesData($connections[0]?.source);

	$: {
		columns = $nodeData?.columns || [];
		values = $nodeData?.values || [];
	}

	$: {
		dataToPlot = {
			labels: values.map((e) => e[xColumn]),
			datasets: [{ label: yColumn, data: values.map((e) => e[yColumn]) }]
		};
	}
</script>

<NodeWrapper label="Graph" resizable={true}>
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
