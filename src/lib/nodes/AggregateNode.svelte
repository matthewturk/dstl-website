<script lang="ts" context="module">
	import { ArrowRightEndOnRectangle } from '@steeze-ui/heroicons';
	export const icon = ArrowRightEndOnRectangle;
</script>

<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useNodesData,
		useHandleConnections,
		useSvelteFlow
	} from '@xyflow/svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, XCircle } from '@steeze-ui/heroicons';
	import { AggregationType } from './constants';
	import * as aq from 'arquero';
	import NodeWrapper from './NodeWrapper.svelte';
	export let highlighted = false;
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
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	const { updateNodeData } = useSvelteFlow();
	let table: aq.internal.ColumnTable = data['table'] || null;
	let aggregationType: AggregationType = data['AggregationType'] || AggregationType.Count;
	let column: string = data['column'] || '';

	const opMap: { [key: AggregationType]: aq.internal.Verb } = {
		[AggregationType.Count]: aq.op.count,
		[AggregationType.Sum]: aq.op.sum,
		[AggregationType.Mean]: aq.op.mean,
		[AggregationType.Average]: aq.op.mean,
		[AggregationType.Min]: aq.op.min,
		[AggregationType.Max]: aq.op.max,
		[AggregationType.StdDev]: aq.op.stdev,
		[AggregationType.Variance]: aq.op.variance,
		[AggregationType.Mode]: aq.op.mode,
		[AggregationType.Median]: aq.op.median,
		[AggregationType.Quantile]: aq.op.quantile
	};

	let selectedColumns: Record<string, boolean> = {};

	const operationLabels: Record<string, string> = {
		sum: 'Total (sum)',
		mean: 'Average (mean)',
		count: 'Count of rows',
		min: 'Smallest (min)',
		max: 'Largest (max)',
		stddev: 'Spread (standard deviation)',
		variance: 'Variance',
		mode: 'Most common (mode)',
		median: 'Middle value (median)'
	};
	// 'average' duplicates 'mean' and 'quantile' needs an extra setting, so neither is offered
	const operationChoices = Object.values(AggregationType).filter(
		(t) => t !== AggregationType.Average && t !== AggregationType.Quantile
	);

	let message = '';

	function processData() {
		if (!table) {
			message = 'Connect a data block (like Upload Data) to this block first.';
			return;
		}
		if (!column) {
			message = 'Choose a column to group rows by.';
			return;
		}
		if (opMap[aggregationType] === undefined) {
			message = 'Choose a calculation.';
			return;
		}
		const chosen = table.columnNames().filter((col) => selectedColumns[col] && col !== column);
		if (chosen.length === 0) {
			message = 'Click one or more columns above to calculate on (not the one you group by).';
			return;
		}
		const rollUps = Object.fromEntries(chosen.map((col) => [col, opMap[aggregationType](col)]));
		const v = table.groupby(column).rollup(rollUps);
		updateNodeData(id, { column, aggregationType, table: v });
		message = `Done: ${v.numRows()} groups. Connect this block to a Chart to see them.`;
	}

	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;
	$: {
		if (table) {
			selectedColumns = table.columnNames().reduce((acc, col) => {
				acc[col] = false;
				return acc;
			}, {});
		}
	}

	function toggleColumn(column: string): void {
		selectedColumns[column] = !selectedColumns[column];
	}
</script>

<NodeWrapper
	{highlighted}
	{id}
	label={column ? `Group & Summarize by ${column}` : 'Group & Summarize'}
	{icon}
>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div class="flex flex-col h-full min-h-0 gap-2">
		<!-- minmax(0,1fr) lets the dropdowns shrink to the block instead of growing with long column names -->
		<div class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 shrink-0">
			<label for="column" class="whitespace-nowrap">Group rows by</label>
			<select id="column" class="select w-full min-w-0 truncate" bind:value={column}>
				<option value="" disabled>Choose a column…</option>
				{#if table}
					{#each $nodeData?.table?.columnNames() as col, index}
						<option value={col}>{col}</option>
					{/each}
				{/if}
			</select>
			<label for="aggregationType" class="whitespace-nowrap">Calculate</label>
			<select
				id="aggregationType"
				class="select w-full min-w-0 truncate"
				bind:value={aggregationType}
				on:input={(event) => {
					aggregationType = event.currentTarget.value;
				}}
			>
				{#each operationChoices as type}
					<option value={type}>{operationLabels[type] ?? type}</option>
				{/each}
			</select>
		</div>
		<p class="text-xs opacity-80 shrink-0">Click the columns you want to calculate on:</p>
		<!-- the column chips scroll inside the block if there are too many to fit -->
		<div class="flex flex-wrap content-start gap-1 flex-1 min-h-0 overflow-y-auto nowheel nodrag">
			{#each Object.keys(selectedColumns) as f}
				<button
					class="chip max-w-full {selectedColumns[f] ? 'variant-filled' : 'variant-soft'}"
					on:click={() => {
						toggleColumn(f);
					}}
					on:keypress
				>
					<span><Icon src={selectedColumns[f] ? CheckCircle : XCircle} size="1rem" /></span>
					<span class="truncate">{f}</span>
				</button>
			{/each}
		</div>
		<!-- Apply and its message stay pinned to the bottom of the block, centred -->
		<div class="shrink-0 flex flex-col items-center text-center">
			<button type="button" class="btn variant-filled" on:click={processData}>Apply</button>
			{#if message}
				<p class="mt-2 text-xs max-w-full break-words">{message}</p>
			{/if}
		</div>
	</div>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
