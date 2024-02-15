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
	import ImportNode from './ImportNode.svelte';
	import UploadFileNode from './UploadFileNode.svelte';
	import PropertiesNode from './PropertiesNode.svelte';
	import GraphWrapperNode from './GraphWrapperNode.svelte';
	import ContextMenu from './ContextMenu.svelte';
	const nodeTypes = {
		sortNode: SortNode,
		aggregateNode: AggregateNode,
		importNode: ImportNode,
		uploadNode: UploadFileNode,
		propertiesNode: PropertiesNode,
		graphWrapperNode: GraphWrapperNode
	};
	const nodes = writable<Node[]>([
		{
			id: '1',
			type: 'sortNode',
			position: { x: 100, y: 100 },
			data: { sortOrder: writable('ascending'), sortColumn: writable('') }
		},
		{
			id: '2',
			type: 'aggregateNode',
			position: { x: 200, y: 200 },
			data: {
				type: writable('sum'),
				column: writable('column1'),
				columns: writable(['column1', 'column2'])
			}
		},
		{
			id: '3',
			type: 'importNode',
			position: { x: 100, y: 200 },
			data: { url: writable('https://example.com/data.csv'), format: writable('csv') }
		},
		{
			id: '4',
			type: 'uploadNode',
			position: { x: 200, y: 100 },
			data: { values: writable([]), columns: writable([]) }
		},
		{
			id: '5',
			type: 'propertiesNode',
			position: { x: 300, y: 100 },
			data: {}
		},
		{
			id: '6',
			type: 'propertiesNode',
			position: { x: 350, y: 100 },
			data: {}
		},
		{
			id: '7',
			type: 'graphWrapperNode',
			position: { x: 400, y: 100 },
			data: {}
		}
	]);

	const initialEdges = []; //{ id: 'e1', source: '1', target: '2' }];

	const edges = writable(initialEdges);

	let menu: { id: string; top?: number; left?: number; right?: number; bottom?: number } | null;
	let width: number;
	let height: number;

	function handleContextMenu({ detail: { event } }) {
		// Prevent native context menu from showing
		event.preventDefault();
		console.log("hi");

		// Calculate position of the context menu. We want to make sure it
		// doesn't get positioned off-screen.
		menu = {
			id: node.id,
			top: event.clientY < height - 200 ? event.clientY : undefined,
			left: event.clientX < width - 200 ? event.clientX : undefined,
			right: event.clientX >= width - 200 ? width - event.clientX : undefined,
			bottom: event.clientY >= height - 200 ? height - event.clientY : undefined
		};
	}
	function handlePaneClick() {
		menu = null;
		console.log("there");
	}
</script>

<div class="w-full h-full">
	<SvelteFlowProvider>
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			fitView
			on:panecontextmenu={handleContextMenu}
			on:paneclick={handlePaneClick}
		>
			<MiniMap class="bg-slate-900" zoomable pannable height={120} />
			<Controls />
			<Background class="bg-slate-500" gap={16} />
			<Background />
			{#if menu}
				<ContextMenu
					onClick={handlePaneClick}
					id={menu.id}
					top={menu.top}
					left={menu.left}
					right={menu.right}
					bottom={menu.bottom}
				/>
			{/if}
		</SvelteFlow>
	</SvelteFlowProvider>
</div>
