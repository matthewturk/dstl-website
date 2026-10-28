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
		useNodesData,
		useSvelteFlow
	} from '@xyflow/svelte';
	import { Line, Scatter, Bar } from 'svelte-chartjs';
	import * as aq from 'arquero';
	//import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
	import 'chart.js/auto';
	import type { ChartData, ChartOptions } from 'chart.js';
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
	const { updateNodeData } = useSvelteFlow();
	let xColumn: string = data['xColumn'] || '';
	let yColumn: string = data['yColumn'] || '';
	let plotType: string = data['plotType'] || 'bar';

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	let table: aq.internal.ColumnTable | null = data['table'] || null;
	let columns: string[] = [];
	let numericColumns: string[] = [];
	let rows: { [key: string]: any }[] = [];

	const COLOR = 'rgb(59, 130, 246)';
	const COLOR_FILL = 'rgba(59, 130, 246, 0.65)';

	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;
	$: updateNodeData(id, { xColumn, yColumn, plotType });

	function isNumber(v: unknown) {
		return typeof v === 'number' && !Number.isNaN(v);
	}

	$: {
		if (table && table.columnNames) {
			columns = table.columnNames();
			rows = table.objects() as { [key: string]: any }[];
			// a column is numeric if every filled-in value is a number
			numericColumns = columns.filter(
				(c) => rows.some((r) => isNumber(r[c])) && rows.every((r) => r[c] == null || isNumber(r[c]))
			);
		} else {
			columns = [];
			rows = [];
			numericColumns = [];
		}
	}

	// Sensible starting choices: first column on X, first numeric column on Y
	$: if (columns.length && !columns.includes(xColumn)) xColumn = columns[0];
	$: if (numericColumns.length && !numericColumns.includes(yColumn))
		yColumn = numericColumns.find((c) => c !== xColumn) ?? numericColumns[0];

	function buildData(type: string, rows: { [key: string]: any }[], x: string, y: string) {
		if (type === 'scatter') {
			return {
				datasets: [
					{
						label: `${y} vs ${x}`,
						data: rows.map((r) => ({ x: Number(r[x]), y: Number(r[y]) })),
						backgroundColor: COLOR,
						pointRadius: 4
					}
				]
			} as ChartData<any, any, any>;
		}
		return {
			labels: rows.map((r) => r[x]),
			datasets: [
				{
					label: y,
					data: rows.map((r) => r[y]),
					backgroundColor: COLOR_FILL,
					borderColor: COLOR,
					borderWidth: 2,
					tension: 0.25,
					pointRadius: rows.length > 60 ? 0 : 3
				}
			]
		} as ChartData<any, any, any>;
	}

	function buildOptions(type: string, x: string, y: string): ChartOptions<any> {
		const xTicks: any = { autoSkip: true, maxTicksLimit: 14, maxRotation: 45 };
		if (type !== 'scatter') {
			// shorten very long category names so they don't crowd the axis
			xTicks.callback = function (this: any, value: any) {
				const label = String(this.getLabelForValue(value));
				return label.length > 24 ? label.slice(0, 23) + '…' : label;
			};
		}
		return {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				title: { display: !!(x && y), text: `${y} by ${x}`, font: { size: 14 } },
				tooltip: {
					callbacks: {
						// first line: the category (X); second line: the value (Y)
						title: (items: any[]) =>
							items.length
								? type === 'scatter'
									? `${x}: ${Number(items[0].parsed.x).toLocaleString()}`
									: `${x}: ${items[0].label}`
								: '',
						label: (ctx: any) => `${y}: ${Number(ctx.parsed?.y ?? ctx.raw).toLocaleString()}`
					}
				}
			},
			scales: {
				x: { title: { display: true, text: x }, ticks: xTicks },
				y: {
					beginAtZero: true,
					title: { display: true, text: y },
					ticks: { callback: (v: any) => Number(v).toLocaleString() }
				}
			}
		};
	}

	$: dataToPlot = buildData(plotType, rows, xColumn, yColumn);
	$: options = buildOptions(plotType, xColumn, yColumn);
</script>

<NodeWrapper {id} {icon} label="Chart" resizable={true}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	{#if rows.length === 0}
		<p class="p-2 text-sm">
			Nothing to draw yet. Connect a data block (for example Group &amp; Summarize) to the dot on
			this block's left edge.
		</p>
	{:else}
		<div class="flex flex-col h-full min-h-0">
			<div class="grid grid-cols-3 gap-2 mb-2 shrink-0">
				<label class="label">
					<span>Chart type</span>
					<select class="select" bind:value={plotType}>
						<option value="bar">Bar</option>
						<option value="line">Line</option>
						<option value="scatter">Scatter</option>
					</select>
				</label>
				<label class="label">
					<span>X-axis</span>
					<select class="select" bind:value={xColumn}>
						{#each columns as field}
							<option value={field}>{field}</option>
						{/each}
					</select>
				</label>
				<label class="label">
					<span>Y-axis (numbers)</span>
					<select class="select" bind:value={yColumn}>
						{#each numericColumns as field}
							<option value={field}>{field}</option>
						{/each}
					</select>
				</label>
			</div>
			{#if numericColumns.length === 0}
				<p class="p-2 text-sm">This data has no number columns to chart.</p>
			{:else if plotType === 'scatter' && !numericColumns.includes(xColumn)}
				<p class="p-2 text-sm">Scatter charts need a number column on the X-axis.</p>
			{:else}
				<div class="relative flex-1 min-h-[10rem] w-full bg-white rounded">
					{#if plotType === 'line'}
						<Line data={dataToPlot} {options} />
					{:else if plotType === 'scatter'}
						<Scatter data={dataToPlot} {options} />
					{:else}
						<Bar data={dataToPlot} {options} />
					{/if}
				</div>
				<p class="mt-1 text-xs opacity-80 shrink-0">
					Showing {rows.length.toLocaleString()} rows.
					{#if rows.length > 40}
						That is a lot of bars. To compare categories, add a Group &amp; Summarize block first.
					{/if}
				</p>
			{/if}
		</div>
	{/if}
</NodeWrapper>
