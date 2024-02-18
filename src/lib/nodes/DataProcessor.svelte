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
		type NodeTypes,
		type Edge
	} from '@xyflow/svelte';

	import SortNode from './SortNode.svelte';
	import { icon as SortIcon } from './SortNode.svelte';
	import AggregateNode from './AggregateNode.svelte';
	import {icon as AggregateIcon} from './AggregateNode.svelte';
	import ImportNode from './ImportNode.svelte';
	import { icon as ImportIcon } from './ImportNode.svelte';
	import UploadFileNode from './UploadFileNode.svelte';
	import { icon  as UploadFileIcon } from './UploadFileNode.svelte';
	import PropertiesNode from './PropertiesNode.svelte';
	import { icon as PropertiesIcon } from './PropertiesNode.svelte';
	import GraphWrapperNode from './GraphWrapperNode.svelte';
	import { icon as GraphWrapperIcon } from './GraphWrapperNode.svelte';
	import SpreadsheetNode from './SpreadsheetNode.svelte';
	import { icon as SpreadsheetIcon } from './SpreadsheetNode.svelte';
	import ContextMenu from './ContextMenu.svelte';

	const nodeTypes: NodeTypes = {
		sortNode: SortNode,
		aggregateNode:  AggregateNode, 
		importNode:  ImportNode,
		uploadNode:  UploadFileNode,
		propertiesNode: PropertiesNode,
		graphWrapperNode: GraphWrapperNode,
		spreadsheetNode:  SpreadsheetNode
	};
	const nodeIcons = {
		sortNode: SortIcon,
		aggregateNode: AggregateIcon,
		importNode: ImportIcon,
		uploadNode: UploadFileIcon,
		propertiesNode: PropertiesIcon,
		graphWrapperNode: GraphWrapperIcon,
		spreadsheetNode: SpreadsheetIcon
	}
	
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

	const initialEdges: Edge[] = [];

	const edges = writable(initialEdges);

	let menu: { top?: number; left?: number; right?: number; bottom?: number } | null;
	let width: number;
	let height: number;

	function handleContextMenu({ detail: { event } }) {
		// Prevent native context menu from showing
		event.preventDefault();

		// Calculate position of the context menu. We want to make sure it
		// doesn't get positioned off-screen.
		menu = {
			top: event.offsetY < height - 200 ? event.offsetY : undefined,
			left: event.offsetX < width - 200 ? event.offsetX : undefined,
			right: event.offsetX >= width - 200 ? width - event.offsetX : undefined,
			bottom: event.offsetY >= height - 200 ? height - event.offsetY : undefined
		};
	}
	function handlePaneClick() {
		menu = null;
	}
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
	<SvelteFlowProvider>
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			fitView
			on:panecontextmenu={handleContextMenu}
			on:paneclick={handlePaneClick}
			class="bg-surface-500/5"
		>
			<MiniMap class="bg-surface-900" zoomable pannable height={120} />
			<Controls />
			<Background class="bg-surface-500" gap={16} />
			<Background />
			{#if menu}
				<ContextMenu
					{nodeTypes}
					{nodeIcons}
					onClick={handlePaneClick}
					top={menu.top}
					left={menu.left}
					right={menu.right}
					bottom={menu.bottom}
				/>
			{/if}
		</SvelteFlow>
	</SvelteFlowProvider>
</div>
