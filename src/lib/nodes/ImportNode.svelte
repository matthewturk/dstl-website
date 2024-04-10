<script lang="ts" context="module">
	import { GlobeAlt } from '@steeze-ui/heroicons';
	export const icon = GlobeAlt;
</script>

<script lang="ts">
	import * as aq from 'arquero';
	import { Handle, Position, type NodeProps, useSvelteFlow } from '@xyflow/svelte';
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
	//export let columns: $$Props['columns'];
	const { updateNodeData } = useSvelteFlow();
	let url: string = '';
	let table: aq.internal.ColumnTable;
	let format: 'CSV' | 'JSON' | 'Parquet' = 'CSV';
	async function loadFromURL() {
		table = await aq.load(url);
	}

	$: updateNodeData(id, { table });
	$: {
		if (data['inputTable'] && data['inputTable'] !== table) {
			table = data['inputTable'];
		}
	}
</script>

<NodeWrapper {id} {icon} label="Import Data">
	<input type="text" id="url" bind:value={url} />
	<select id="format" bind:value={format}>
		<option value="CSV">csv</option>
		<option value="JSON">json</option>
		<option value="Parquet">parquet</option>
	</select>
	<button type="button" class="btn variant-filled-primary" on:click={(e) => loadFromURL()}>
		Load from URL
	</button>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
