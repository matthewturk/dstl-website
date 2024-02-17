<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useNodesData,
		useSvelteFlow,
		useHandleConnections
	} from '@xyflow/svelte';
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let isConnectable: $$Props['isConnectable'];
    const handler = new DataHandler([{}], { rowsPerPage: 10 });
    const rows = handler.getRows();

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
        handler.setRows(values);
	}

</script>

<NodeWrapper label="Spreadsheet" resizable={true}>
<Datatable {handler}>
	<table>
		<thead>
			<tr>
				{#each columns as column}
					<Th {handler} orderBy={column}>{column}</Th>
				{/each}
			</tr>
			<tr>
				{#each columns as column}
					<ThFilter {handler} filterBy={column}/>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					{#each columns as column}
						<td>{row[column]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</Datatable>
<Handle type="target" position={Position.Left} {isConnectable} />
</NodeWrapper>