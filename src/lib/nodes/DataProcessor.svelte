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

	const nodeTypes: NodeTypes = {
		sortNode: SortNode,
		aggregateNode: AggregateNode,
		//importNode: ImportNode,
		uploadNode: UploadFileNode,
		propertiesNode: PropertiesNode,
		//distributionChartNode: DistributionChartNode,
		graphWrapperNode: GraphWrapperNode,
		spreadsheetNode: SpreadsheetNode,
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

	const nodes = writable<Node[]>([
		{
			id: Math.random().toString(36).substring(7),
			type: 'uploadNode',
			position: { x: 500, y: 100 },
			data: { values: writable([{}]), columns: writable([]) }
		},
		{
			id: Math.random().toString(36).substring(7),
			type: 'propertiesNode',
			position: { x: 600, y: 0 },
			data: {}
		},
		{
			id: Math.random().toString(36).substring(7),
			type: 'spreadsheetNode',
			position: { x: 750, y: 100 },
			data: { columns: [], values: [{}] }
		}
	]);

	const initialEdges: Edge[] = [
		{ id: Math.random().toString(36).substring(7), source: $nodes[0].id, target: $nodes[1].id },
		{ id: Math.random().toString(36).substring(7), source: $nodes[0].id, target: $nodes[2].id }
	];

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

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
	<SvelteFlowProvider>
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			on:panecontextmenu={handleContextMenu}
			on:paneclick={handlePaneClick}
			class="bg-surface-500/5"
		>
			<GuidelinesPanel bind:visible={guidelinesVisible}/>
			<MiniMap class="bg-surface-900" zoomable pannable height={120} />
			<ControlPanel {guidelinesVisible}/>
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
	</SvelteFlowProvider>
</div>
