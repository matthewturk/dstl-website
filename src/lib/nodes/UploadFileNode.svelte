<script lang="ts" context="module">
	import { ArrowDownTray } from '@steeze-ui/heroicons';
	export const icon = ArrowDownTray;
</script>

<script lang="ts">
	import { Handle, Position, type NodeProps, useSvelteFlow } from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import * as Papa from 'papaparse';
	import * as aq from 'arquero';
	import { onMount } from 'svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	import { csvString } from '$lib/exampledata';
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
	let files: FileList;
	let table: aq.internal.ColumnTable;
	onMount(async() => {
		table = await aq.fromCSV(csvString);
		console.log(table);
	});

	async function parseFile() {
		let text = await files[0].text();
		table = await aq.fromCSV(text);
	}

	$: updateNodeData(id, { table });
</script>

<NodeWrapper {icon} label="Upload">
	<div class="flex-row">
		<label for="file" class="p-2 font-semibold text-xl">{(files || [{ name: '' }])[0].name}</label>
		<FileButton name="file" multiple="false" bind:files on:change={parseFile} />
	</div>
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
