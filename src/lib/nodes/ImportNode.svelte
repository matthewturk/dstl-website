<script lang="ts" context="module">
	import { GlobeAlt } from '@steeze-ui/heroicons';
	export const icon = GlobeAlt;
</script>
<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import NodeWrapper from './NodeWrapper.svelte';
    type $$Props = NodeProps;
    export let id: $$Props['id']; id;
    export let data: $$Props['data']; data;
    export let dragHandle: $$Props['dragHandle'] = undefined; dragHandle;
    export let type: $$Props['type']  = undefined; type;
    export let selected: $$Props['selected'] = undefined; selected;
    export let isConnectable: $$Props['isConnectable'] = undefined; isConnectable;
    export let zIndex: $$Props['zIndex'] = undefined; zIndex;
    export let width: $$Props['width'] = undefined; width;
    export let height: $$Props['height'] = undefined; height;
    export let dragging: $$Props['dragging']; dragging;
    export let targetPosition: $$Props['targetPosition'] = undefined; targetPosition;
    export let sourcePosition: $$Props['sourcePosition'] = undefined; sourcePosition;
	//export let columns: $$Props['columns'];
	const { url, format } = data;
</script>

<NodeWrapper {icon} label="Import Data">
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
