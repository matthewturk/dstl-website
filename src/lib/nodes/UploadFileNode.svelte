<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import * as Papa from 'papaparse';
	import NodeWrapper from './NodeWrapper.svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
	export let isConnectable: $$Props['isConnectable'];

	let files: FileList;

	interface IValueArray {
		[key: string]: number;
	}

	const parseCSV = (file: File): Promise<Papa.ParseResult<any>> => {
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				complete: resolve,
				dynamicTyping: true,
				header: true,
				error: reject
			});
		});
	};

	async function parseFile() {
		console.log(files[0]);

		let results: Papa.ParseResult<any>;
		try {
			results = await parseCSV(files[0]);
		} catch (error) {
			console.error('Error:', error);
			return;
		}

		//fields = [...(results.meta.fields || [])];
		//value = [...results.data];
	}
</script>

<NodeWrapper label="Sort">
	<FileButton name="file" multiple="false" bind:files on:change={parseFile} />
	<Handle type="source" position={Position.Right} {isConnectable} />
</NodeWrapper>
