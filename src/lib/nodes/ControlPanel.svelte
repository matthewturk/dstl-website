<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	import {
		Controls,
		ControlButton,
		useNodes, useEdges, useUpdateNodeInternals,
		type Node, type Edge
	} from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { ArrowDownTray } from '@steeze-ui/heroicons';
	import { ArrowUpTray } from '@steeze-ui/heroicons';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import { loadGraphFromJSON, serializeGraphToJSON } from '$lib/nodeserializer';
	let files: FileList;
	const nodes = useNodes();	
	const edges = useEdges();
	const updateNodeInternals = useUpdateNodeInternals();
	async function parseAndLoad() {
		const text = await files[0].text()
		loadGraphFromJSON($nodes, $edges, text);
		$nodes.forEach(n => updateNodeInternals(n.id))
	}
	async function serializeAndSave() {
		const v = serializeGraphToJSON($nodes, $edges);
    const link = document.createElement("a");
    const blob = new Blob([v], { type: "text/json" });

    link.download = "DSTL-nodes.json";
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
	}
</script>

<Controls>
	<ControlButton>
		<FileButton name="files" bind:files on:change={parseAndLoad} button=""><Icon size="1.25rem" src={ArrowUpTray} /></FileButton>
	</ControlButton>
	<ControlButton on:click={serializeAndSave}>
		<Icon size="1.25rem" src={ArrowDownTray} />
	</ControlButton>
</Controls>
