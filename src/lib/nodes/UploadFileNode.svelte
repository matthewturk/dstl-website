<script lang="ts" context="module">
	import { ArrowDownTray } from '@steeze-ui/heroicons';
	export const icon = ArrowDownTray;
</script>

<script lang="ts">
	import { Handle, Position, type NodeProps, useSvelteFlow } from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import * as aq from 'arquero';
	import { michiganLibraryDataString } from '$lib/exampledata';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let id: $$Props['id'];
	id;
	export let data: $$Props['data'];
	data;
	export let dragHandle: $$Props['dragHandle'] = undefined;
	dragHandle;
	export let type: $$Props['type'] = undefined;
	type;
	export let selected: $$Props['selected'] = undefined;
	selected;
	export let isConnectable: $$Props['isConnectable'] = undefined;
	isConnectable;
	export let zIndex: $$Props['zIndex'] = undefined;
	zIndex;
	export let width: $$Props['width'] = undefined;
	width;
	export let height: $$Props['height'] = undefined;
	height;
	export let dragging: $$Props['dragging'];
	dragging;
	export let targetPosition: $$Props['targetPosition'] = undefined;
	targetPosition;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	sourcePosition;
	const { updateNodeData } = useSvelteFlow();
	let highlighted = false;
	let files: FileList;
	let sampleName = '';
	let table: aq.internal.ColumnTable;

	async function parseFile() {
		sampleName = '';
		let text = await files[0].text();
		table = await aq.fromCSV(text);
	}

	async function useSample() {
		table = await aq.fromCSV(michiganLibraryDataString);
		sampleName = 'Michigan public libraries (sample)';
	}

	$: highlighted = data['highlighted'] || false;
	$: updateNodeData(id, { table });
	$: {
		if (data['inputTable'] && data['inputTable'] !== table){
			table = data['inputTable'];
		}
	}
</script>

<NodeWrapper {highlighted} {id} {icon} label="Upload Data">
	<div class="flex flex-col items-start gap-2">
		<p class="font-semibold text-sm">{files?.[0]?.name || sampleName || 'No data loaded yet'}</p>
		<FileButton name="file" multiple="false" bind:files on:change={parseFile}>Choose a CSV file</FileButton>
		<button type="button" class="btn btn-sm variant-ghost-surface" on:click={useSample}
			>Use sample library data</button
		>
	</div>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
