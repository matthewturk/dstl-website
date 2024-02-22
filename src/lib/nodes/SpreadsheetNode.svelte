<script lang="ts" context="module">
	import { TableCells } from '@steeze-ui/heroicons';
	export const icon = TableCells;
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
	import { DataHandler, Datatable, Th, ThFilter, type Row, type Field } from '@vincjo/datatables';
	import NodeWrapper from './NodeWrapper.svelte';
	import type * as aq from 'arquero';
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
	const handler = new DataHandler([{}], { rowsPerPage: 10 });
	const rows = handler.getRows();
	let columns: string[] = [];

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let rowCols: Field<Row>[];
	let table: aq.internal.ColumnTable;

	$: nodeData = useNodesData($connections[0]?.source);

	$: {
		table = $nodeData?.table;
		if (!table) {
			rowCols = [];
			handler.setRows([{}]);
		} else {
			rowCols = table?.columnNames().map((column) => column as Field<Row>);
			handler.setRows(table?.objects());
		}
	}

</script>

<NodeWrapper label="Spreadsheet" resizable={true} {icon}>
	<div class="max-w-full overflow-x-auto">
		<Datatable {handler}>
			<table>
				<thead>
					<tr>
						{#each rowCols as column}
							<Th {handler} orderBy={column}>{column}</Th>
						{/each}
					</tr>
					<tr>
						{#each rowCols as column}
							<ThFilter {handler} filterBy={column} />
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each ($rows || []) as row}
						<tr>
							{#each rowCols as column}
								<td>{row[column]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	</div>
	<Handle type="target" position={Position.Left} {isConnectable} />
</NodeWrapper>
