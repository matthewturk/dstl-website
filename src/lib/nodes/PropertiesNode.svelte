<script lang="ts" context="module">
	import { InformationCircle } from '@steeze-ui/heroicons';
	export const icon = InformationCircle;
</script>

<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useNodesData,
		useHandleConnections
	} from '@xyflow/svelte';
	import { Table, type TableSource, tableMapperValues} from '@skeletonlabs/skeleton';
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
	interface IColumnStats {
		column: string;
		min: number;
		max: number;
		mean: number;
		count: number;
		numUnique: number;
	}
    let highlighted = false;
	let statistics: IColumnStats[] = [];
	let propertiesTable: TableSource = { head: [], body: [] };
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	// Not sure why this is internal.
	let table: aq.internal.ColumnTable;
	let columns: string[] = [];

	$: highlighted = data['highlighted'] || false;
	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;
	$: {
		if (table) {
			columns = table.columnNames();
		} else {
			columns = [];
		}
	}

	$: {
		if (table) {
			// start from an empty list each time, otherwise rows pile up after a second upload
			const stats: IColumnStats[] = [];
			columns.forEach((c) => {
				const r: any = table
					.rollup({
						min: aq.op.min(c),
						max: aq.op.max(c),
						mean: aq.op.mean(c),
						count: aq.op.valid(c),
						numUnique: aq.op.distinct(c)
					})
					.objects()[0];
				stats.push({
					column: c,
					...r,
					mean: typeof r.mean === 'number' ? Math.round(r.mean * 100) / 100 : r.mean
				} as IColumnStats);
			});
			statistics = stats;
			propertiesTable = {
				head: ['Column', 'Min', 'Max', 'Average', 'Rows filled in', 'Unique values'],
				body: tableMapperValues(statistics, ['column', 'min', 'max', 'mean', 'count', 'numUnique'])
			};
		}
	}

</script>

<NodeWrapper {highlighted} {id} {icon} label="Column Summary">
	<div class="max-h-72 overflow-y-auto max-w-2/3 overflow-x-auto">
		<Table source={propertiesTable} interactive={true}/>
	</div>
	<Handle type="target" position={Position.Left} {isConnectable} />
</NodeWrapper>
