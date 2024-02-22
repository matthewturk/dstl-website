<script lang="ts" context="module">
	import { Python } from '@steeze-ui/simple-icons';
	export const icon = Python;
</script>

<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useNodesData,
		useHandleConnections
	} from '@xyflow/svelte';
	import NodeWrapper from './NodeWrapper.svelte';
	import { pyodide } from '$lib/store';
	import { loadPyodide } from 'pyodide';
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
	//export let columns: $$Props['columns'];
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});
	$: nodeData = useNodesData($connections[0]?.source);
	let script = '';
	let running = false;
	async function executeScript() {
		if (!$pyodide) {
			//@ts-ignore
			$pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' });
			await $pyodide.loadPackage('pandas');
		}
		running = true;
		console.log('Running');
        // Even using promises this blocks.  Let's figure that out!
		$pyodide.runPythonAsync(script).then((result) => {
			console.log('Finished', result);
			running = false;
		});
	}
</script>

<NodeWrapper label="Python Script" {icon}>
	<div class="flex flex-col w-96">
		<div class="flex flex-row">
			<button type="button" class="btn variant-filled w-16 p-1 m-1" on:click={executeScript}
				>Run</button
			>
			<button
				type="button"
				class="btn variant-filled w-16 p-1 m-1"
				on:click={() => {
					script = '';
				}}>Clear</button
			>
			{#if running}
				<span>Running...</span>
			{/if}
		</div>
		<Handle type="target" position={Position.Left} {isConnectable} />
		<Handle type="source" position={Position.Right} {isConnectable} />
		<textarea
			class="textarea m-1 p-1"
			rows="9"
			bind:value={script}
			placeholder="Enter your Python script"
		/>
	</div>
</NodeWrapper>