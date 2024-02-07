<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		type Node,
		type NodeTypes
	} from '@xyflow/svelte';

import SortNode from './SortNode.svelte';
const nodeTypes = {
    sortNode: SortNode
};
const order1 = writable('ascending');
const order2 = writable('descending');
const nodes = writable<Node[]>([
    {
        id: '1',
        type: 'sortNode',
        position: { x: 100, y: 100 },
        data: { order: order1 }
    },
    {
        id: '2',
        type: 'sortNode',
        position: { x: 200, y: 200 },
        data: { order: order2 }
    }
]);

const initialEdges = [
    { id: 'e1', source: '1', target: '2' }
];

const edges = writable(initialEdges);
</script>

<div class="w-full h-full">
	<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
		<Background patternColor="#aaa" gap={16} />
		<Controls />
		<MiniMap zoomable pannable height={120} />
	</SvelteFlow>
</div>
