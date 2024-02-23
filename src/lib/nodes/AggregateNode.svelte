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
	import { AggregationType } from './constants';
	import * as aq from 'arquero';
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
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	const { updateNodeData } = useSvelteFlow();
	let table: aq.internal.ColumnTable;
	let aggregationType: AggregationType = AggregationType.Count;
	let column: string = '';

	const opMap: { [key: AggregationType]: aq.internal.Verb } = {
		[AggregationType.Count]: aq.op.count,
		[AggregationType.Sum]: aq.op.sum,
		[AggregationType.Mean]: aq.op.mean,
		[AggregationType.Min]: aq.op.min,
		[AggregationType.Max]: aq.op.max,
		[AggregationType.StdDev]: aq.op.stdev,
		[AggregationType.Variance]: aq.op.variance,
		[AggregationType.Mode]: aq.op.mode,
		[AggregationType.Median]: aq.op.median,
		[AggregationType.Quantile]: aq.op.quantile
	};

	function processData(event) {
		console.log('Processing data');
		if (opMap[aggregationType] === undefined) {
			console.log('Invalid aggregation type');
			return;
		}
		const rollUps = Object.fromEntries(table.columnNames().map((col) => [col, opMap[aggregationType](col)]));
		delete rollUps[column];
		const v = table.groupby(column).rollup(rollUps);
		updateNodeData(id, { table: v });
	}

	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;
</script>

<NodeWrapper label="Aggregate {column || ''}" {icon}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<select id="column" bind:value={column}>
		{#if table}
			{#each $nodeData?.table?.columnNames() as col, index}
				<option value={col}>{col}</option>
			{/each}
		{/if}
	</select>
	<select
		id="aggregationType"
		bind:value={aggregationType}
		on:input={(event) => {
			aggregationType = event.currentTarget.value;
		}}
	>
		{#each Object.values(AggregationType) as type}
			<option value={type}>{type}</option>
		{/each}
	</select>
	<button type="button" class="btn variant-filled" on:click={processData}>Process</button>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
