<script lang="ts">
    import {Handle, Position, type NodeProps} from '@xyflow/svelte';
    import { AggregationType } from './constants';
	import NodeWrapper from './NodeWrapper.svelte';
    type $$Props = NodeProps;
    export let data: $$Props['data']
    export let isConnectable: $$Props['isConnectable'];
    //export let columns: $$Props['columns'];
    const { aggregationType, column } = data;
</script>

<NodeWrapper label="Aggregate {column}">
<Handle type="target" position={Position.Left} {isConnectable}/>
<select id="aggregationType" value={$aggregationType} on:input={(event) => {$aggregationType = event.currentTarget.value;}}>
    {#each Object.values(AggregationType) as type}
        <option value={type}>{type}</option>
    {/each}
    </select>
</NodeWrapper>