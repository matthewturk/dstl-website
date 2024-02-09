<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useNodesData,
		useSvelteFlow,
		useHandleConnections
	} from '@xyflow/svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let isConnectable: $$Props['isConnectable'];
	export let id: $$Props['id'];

	const { sortOrder, sortColumn } = data;
	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	let columns: string[] = [];
	let values: { [key: string]: any }[] = [];

	$: nodeData = useNodesData($connections[0]?.source);

	$: {
		columns = $nodeData?.columns || [];
		values = $nodeData?.values || [];
		console.log(values.length);
	}

	$: {
		if ($sortColumn && $sortOrder && values) {
			const sortedValues = [...values];
			sortedValues.sort((a, b) => {
				if (a[$sortColumn] === b[$sortColumn]) return 0;
				return (a[$sortColumn] > b[$sortColumn] ? 1: 0);
			});
			if ($sortOrder === 'descending') {
				console.log("reversing", sortedValues[0], sortedValues.length);
				sortedValues.reverse();
				console.log("reversed", sortedValues[0], sortedValues.length);
			} else {
				console.log("not reversing", sortedValues[0], sortedValues.length);
			}
			updateNodeData(id, { values: sortedValues, columns: columns});
		}
	}
</script>

<NodeWrapper label="Sort">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<select
		id="sortColumn"
		value={$sortColumn}
		on:input={(event) => {
			$sortColumn = event.currentTarget.value;
		}}
		>{#each columns as column}
			<option value={column}>{column}</option>
		{/each}
	</select>
	<select
		id="sortOrder"
		value={$sortOrder}
		on:input={(event) => {
			$sortOrder = event.currentTarget.value;
		}}
	>
		<option value="ascending">Ascending</option>
		<option value="descending">Descending</option>
	</select>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
