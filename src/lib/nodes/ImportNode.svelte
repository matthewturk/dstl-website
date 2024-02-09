<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let isConnectable: $$Props['isConnectable'];
	//export let columns: $$Props['columns'];
	const { url, format } = data;
</script>

<NodeWrapper label="Import Data">
	<input type="text" id="url" value={$url} />
	<select
		id="format"
		value={$format}
		on:input={(event) => {
			$format = event.currentTarget.value;
		}}
	>
		<option value="csv">csv</option>
		<option value="json">json</option>
		<option value="parquet">parquet</option>
	</select>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
