<script lang="ts">
	import GuidelinesPanel from './GuidelinesPanel.svelte';

	import ControlPanel from './ControlPanel.svelte';

	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		SvelteFlowProvider,
		Background,
		MiniMap,
		type Node,
		type NodeTypes,
		type Edge
	} from '@xyflow/svelte';

	import SortNode from './SortNode.svelte';
	import { icon as SortIcon } from './SortNode.svelte';
	import AggregateNode from './AggregateNode.svelte';
	import { icon as AggregateIcon } from './AggregateNode.svelte';
	import ImportNode from './ImportNode.svelte';
	import { icon as ImportIcon } from './ImportNode.svelte';
	import UploadFileNode from './UploadFileNode.svelte';
	import { icon as UploadFileIcon } from './UploadFileNode.svelte';
	import PropertiesNode from './PropertiesNode.svelte';
	import { icon as PropertiesIcon } from './PropertiesNode.svelte';
	import DistributionChartNode from './DistributionChartNode.svelte';
	import { icon as DistributionChartIcon } from './DistributionChartNode.svelte';
	import GraphWrapperNode from './GraphWrapperNode.svelte';
	import { icon as GraphWrapperIcon } from './GraphWrapperNode.svelte';
	import SpreadsheetNode from './SpreadsheetNode.svelte';
	import { icon as SpreadsheetIcon } from './SpreadsheetNode.svelte';
	import MonacoNode from './MonacoNode.svelte';
	import { icon as MonacoIcon } from './MonacoNode.svelte';
	import PythonNode from './PythonNode.svelte';
	import { icon as PythonIcon } from './PythonNode.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import AutoLayout from './AutoLayout.svelte';
	import { tidyLayout } from './layout';

	const nodeTypes: NodeTypes = {
		uploadNode: UploadFileNode,
		propertiesNode: PropertiesNode,
		spreadsheetNode: SpreadsheetNode,
		sortNode: SortNode,
		aggregateNode: AggregateNode,
		graphWrapperNode: GraphWrapperNode
		//importNode: ImportNode,
		//distributionChartNode: DistributionChartNode,
		//monacoNode: MonacoNode,
		//pythonNode: PythonNode
	};
	const nodeIcons = {
		sortNode: SortIcon,
		aggregateNode: AggregateIcon,
		importNode: ImportIcon,
		uploadNode: UploadFileIcon,
		propertiesNode: PropertiesIcon,
		graphWrapperNode: GraphWrapperIcon,
		distributionChartNode: DistributionChartIcon,
		spreadsheetNode: SpreadsheetIcon,
		monacoNode: MonacoIcon,
		pythonNode: PythonIcon
	};

	const startNodes: Node[] = [
		{
			id: Math.random().toString(36).substring(7),
			type: 'uploadNode',
			position: { x: 0, y: 0 },
			data: { values: writable([{}]), columns: writable([]) }
		},
		{
			id: Math.random().toString(36).substring(7),
			type: 'propertiesNode',
			position: { x: 0, y: 0 },
			data: {}
		},
		{
			id: Math.random().toString(36).substring(7),
			type: 'spreadsheetNode',
			position: { x: 0, y: 0 },
			data: { columns: [], values: [{}] }
		}
	];

	const initialEdges: Edge[] = [
		{ id: Math.random().toString(36).substring(7), source: startNodes[0].id, target: startNodes[1].id },
		{ id: Math.random().toString(36).substring(7), source: startNodes[0].id, target: startNodes[2].id }
	];

	// Blocks start neatly arranged left-to-right instead of piled on top of each other
	const nodes = writable<Node[]>(tidyLayout(startNodes, initialEdges));

	const edges = writable<Edge[]>(initialEdges);

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
	let guidelinesVisible = writable<boolean>(true);
</script>

<div class="flex w-full h-full gap-3">
	<SvelteFlowProvider>
		<GuidelinesPanel visible={guidelinesVisible} />
		<div class="flex-1 min-w-0 h-full" bind:clientWidth={width} bind:clientHeight={height}>
			<SvelteFlow
				{nodes}
				{edges}
				{nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
				on:panecontextmenu={handleContextMenu}
				on:paneclick={handlePaneClick}
				class="bg-surface-500/5"
			>
				<MiniMap class="bg-surface-900" zoomable pannable height={120} />
				<ControlPanel {guidelinesVisible} />
				<AutoLayout />
				<Background class="bg-surface-variant-300" gap={16} />
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
		</div>
	</SvelteFlowProvider>
</div>
