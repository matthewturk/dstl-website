<script lang="ts">

  import '@xyflow/svelte/dist/style.css';
import 'tailwindcss/tailwind.css';
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		SvelteFlowProvider,
		Background,
		Controls,
		MiniMap,
		type Node,
		type NodeTypes
	} from '@xyflow/svelte';

	import SortNode from './SortNode.svelte';
    import AggregateNode from './AggregateNode.svelte';
	const nodeTypes = {
		sortNode: SortNode,
        aggregateNode: AggregateNode
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
			type: 'aggregateNode',
			position: { x: 200, y: 200 },
			data: { type: 'sum', column: 'column1', columns: ["column1", "column2"] }
		}
	]);

	const initialEdges = [{ id: 'e1', source: '1', target: '2' }];

	const edges = writable(initialEdges);
</script>

<div class="w-full h-full">
	<SvelteFlowProvider>
	<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
		<MiniMap class="bg-slate-900" zoomable pannable height={120}/>
		<Controls />
		<Background class="bg-slate-500" gap={16} />
	</SvelteFlow>
</SvelteFlowProvider>
</div>
