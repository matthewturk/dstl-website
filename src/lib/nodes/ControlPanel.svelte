<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	import {
		Controls,
		ControlButton,
		useNodes,
		useEdges,
		useUpdateNodeInternals,
		useSvelteFlow,
		addEdge,
		isEdge,
		type Edge
	} from '@xyflow/svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowDownTray, ArrowUpTray, Trash, Squares2x2 } from '@steeze-ui/heroicons';
	import { onMount, tick } from 'svelte';
	import { applyTidy } from './layout';
	import * as aq from 'arquero';
	import { writable } from 'svelte/store';
	export let guidelinesVisible = writable<boolean>(true);
	let files: FileList;
	let fileInput: FileButton;
	const nodes = useNodes();
	const edges = useEdges();
	const updateNodeInternals = useUpdateNodeInternals();
	const { fitView } = useSvelteFlow();

	function tidyUp() {
		applyTidy(nodes, edges, fitView);
	}
	// The flow library's built-in buttons (zoom, fit, lock) only get plain native tooltips,
	// so give them the same quick hover tips as our own buttons.
	const builtInTips: Record<string, string> = {
		'svelte-flow__controls-zoomin': 'Zoom in',
		'svelte-flow__controls-zoomout': 'Zoom out',
		'svelte-flow__controls-fitview': 'Fit all blocks on screen',
		'svelte-flow__controls-interactive': 'Lock or unlock moving blocks'
	};
	onMount(async () => {
		await tick();
		for (const [cls, tip] of Object.entries(builtInTips)) {
			const button = document.querySelector(`.${cls}`);
			if (!button) continue;
			button.classList.add('dstl-ctrl');
			button.setAttribute('data-tip', tip);
			button.removeAttribute('title'); // avoid a second, native tooltip
		}
	});

	async function deleteAllNodes() {
		if (!confirm('Remove every block and start over?')) return;
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
	<ControlButton
		class="dstl-ctrl"
		data-tip="Open a saved workspace"
		aria-label="Open a saved workspace"
	>
		<FileButton name="files" bind:this={fileInput} bind:files on:change={parseAndLoad} button=""
			><Icon size="1.25rem" src={ArrowUpTray} /></FileButton
		>
	</ControlButton>
	<ControlButton
		class="dstl-ctrl"
		data-tip="Save this workspace"
		aria-label="Save this workspace"
		on:click={serializeAndSave}
	>
		<Icon size="1.25rem" src={ArrowDownTray} />
	</ControlButton>
	<ControlButton
		class="dstl-ctrl"
		data-tip="Tidy up: line the blocks up"
		aria-label="Tidy up"
		on:click={tidyUp}
	>
		<Icon size="1.25rem" src={Squares2x2} />
	</ControlButton>
	<ControlButton
		class="dstl-ctrl"
		data-tip="Remove all blocks"
		aria-label="Remove all blocks"
		on:click={deleteAllNodes}
	>
		<Icon size="1.25rem" src={Trash} />
	</ControlButton>
	<ControlButton
		class="dstl-ctrl dstl-help"
		data-tip="Show the quick tour"
		aria-label="Show the quick tour"
		on:click={clickedHelp}
	>
		?
	</ControlButton>
</Controls>
