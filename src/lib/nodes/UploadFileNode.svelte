<script lang="ts" context="module">
	import { ArrowDownTray } from '@steeze-ui/heroicons';
	export const icon = ArrowDownTray;
</script>
<script lang="ts">
	import { Handle, Position, type NodeProps, useSvelteFlow} from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import * as Papa from 'papaparse';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let id: $$Props['id'];
	export let isConnectable: $$Props['isConnectable'];
    const { updateNodeData } = useSvelteFlow();
	let files: FileList;


	const parseCSV = (file: File): Promise<Papa.ParseResult<any>> => {
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				complete: resolve,
				dynamicTyping: true,
				header: true,
				skipEmptyLines: true,
				error: reject
			});
		});
	};

	async function parseFile() {
		let results: Papa.ParseResult<any>;
		try {
			results = await parseCSV(files[0]);
		} catch (error) {
			console.error('Error:', error);
			return;
		}
        updateNodeData(id, { values: results.data, columns: results.meta.fields || [] });
	}
</script>

<NodeWrapper {icon} label="Upload">
	<FileButton name="file" multiple="false" bind:files on:change={parseFile} />
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
