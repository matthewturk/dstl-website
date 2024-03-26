<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	import {
		Controls,
		ControlButton,
		useNodes,
		useEdges,
		useUpdateNodeInternals,
		addEdge,
		isEdge,
		type Edge
	} from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowDownTray, ArrowUpTray, Trash, QuestionMarkCircle } from '@steeze-ui/heroicons';
	import * as aq from 'arquero';
	import { writable } from 'svelte/store';
	export let guidelinesVisible = writable<boolean>(true);
	let files: FileList;
	let fileInput: FileButton;
	const nodes = useNodes();
	const edges = useEdges();
	const updateNodeInternals = useUpdateNodeInternals();
	async function deleteAllNodes() {
		edges.set([]);
		nodes.set([]);
	}
	let loaded = false;
	async function parseAndLoad() {
		if (files.length == 0) return;
		const jsonInput = await files[0].text();
		const graph = JSON.parse(jsonInput, (key, value) => {
			if (key === 'table') {
				return aq.fromJSON(value);
			}
			return value;
		});
		nodes.set(graph.nodes);
		edges.set(graph.edges);
		$nodes.forEach((n) => updateNodeInternals(n.id));
		fileInput.value = '';
	}

	async function serializeAndSave() {
		const v = JSON.stringify(
			{ edges: $edges, nodes: $nodes },
			(key, value) => {
				if (key === 'table' && value.toJSON) {
					return (value as aq.internal.ColumnTable).toJSON();
				}
				return value;
			},
			2
		);
		const link = document.createElement('a');
		const blob = new Blob([v], { type: 'text/json' });

		link.download = 'DSTL-nodes.json';
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

		const evt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		});

		link.dispatchEvent(evt);
		link.remove();
	}

    async function clickedHelp() {
		$guidelinesVisible = true;
	}
</script>

<Controls>
	<ControlButton>
		<FileButton name="files" bind:this={fileInput} bind:files on:change={parseAndLoad} button=""
			><Icon size="1.25rem" src={ArrowUpTray} /></FileButton
		>
	</ControlButton>
	<ControlButton on:click={serializeAndSave}>
		<Icon size="1.25rem" src={ArrowDownTray} />
	</ControlButton>
	<ControlButton on:click={deleteAllNodes}>
		<Icon size="1.25rem" src={Trash} />
	</ControlButton>
	<ControlButton on:click={clickedHelp}>
		<Icon size="1.25rem" src={QuestionMarkCircle} />
	</ControlButton>
</Controls>
