<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let isConnectable: $$Props['isConnectable'];

	const { order } = data;
</script>

<NodeWrapper label="Sort">
	<Handle type="source" position={Position.Left} {isConnectable} />
	<select
		id="sortOrder"
		value={$order}
		on:input={(event) => {
			$order = event.currentTarget.value;
		}}
	>
		<option value="ascending">Ascending</option>
		<option value="descending">Descending</option>
	</select>
	<Handle type="target" position={Position.Right} {isConnectable} />
</NodeWrapper>
