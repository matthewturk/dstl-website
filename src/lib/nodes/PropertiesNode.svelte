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
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let isConnectable: $$Props['isConnectable'];
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
	}
</script>

<NodeWrapper {icon} label="Properties">
 <ul>
	{#each columns as column}
		<li>{column}</li>
	{/each}
</ul>
<p>{Object.values(values[0] || {})}</p>
	<Handle type="target" position={Position.Left} {isConnectable} />
</NodeWrapper>
