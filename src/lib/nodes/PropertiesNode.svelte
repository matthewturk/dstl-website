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
		useSvelteFlow,
		useHandleConnections
	} from '@xyflow/svelte';
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
	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	// Not sure why this is internal.
	let table: aq.internal.ColumnTable;
	let columns: string[] = [];

	$: nodeData = useNodesData($connections[0]?.source);
	$: table = $nodeData?.table;
	$: {
		if (table) {
			columns = table.columnNames();
		} else {
			columns = [];
		}
	}
</script>

<NodeWrapper {icon} label="Properties">
	<div class="max-h-32 overflow-y-auto max-w-2/3 overflow-x-auto">
		<table>
			{#each columns as column}
				<tr><td>{column}</td></tr>
			{/each}
		</table>
	</div>
	<Handle type="target" position={Position.Left} {isConnectable} />
</NodeWrapper>
