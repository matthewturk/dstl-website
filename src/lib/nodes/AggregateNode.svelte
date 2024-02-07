<script lang="ts">
    import {Handle, Position, type NodeProps} from '@xyflow/svelte';
    type $$Props = NodeProps;
    export let data: $$Props['data']
    export let isConnectable: $$Props['isConnectable'];

    const { color } = data;
</script>

<Handle type="target" position={Position.Left} {isConnectable}/>
<div>
    Aggregation
</div>