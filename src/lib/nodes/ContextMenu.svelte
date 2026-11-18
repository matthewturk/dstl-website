<script lang="ts">
	import { useNodes, type NodeTypes, useUpdateNodeInternals } from '@xyflow/svelte';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import { ChevronRight } from '@steeze-ui/heroicons';
	import { nodeInfo } from './constants';
	import { sizeFor } from './layout';

	export let nodeTypes: NodeTypes = {};
	export let nodeIcons: { [key: string]: IconSource } = {};
	export let onClick: (e: MouseEvent | KeyboardEvent) => void;
	export let left: number | undefined;
	export let top: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;

	const nodes = useNodes();
	const updateNodeInternals = useUpdateNodeInternals();

	function addNode(nodeType: string) {
		const newId = Math.random().toString(36).substring(7);
		$nodes.push({
			id: newId,
			type: nodeType,
			position: {
				x: (left || 0) + 5,
				y: (top || 0) + 5
			},
			width: sizeFor(nodeType).width,
			height: sizeFor(nodeType).height,
			data: {}
		});
		updateNodeInternals(newId);
	}
</script>

<div
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
	class="absolute z-10 variant-filled-tertiary context-menu btn-group-vertical"
	on:click={onClick}
	on:keydown={onClick}
	role="menu"
	tabindex="-1"
>
	{#each Object.entries(nodeTypes) as [nodeType, nodeComponent]}
		<button type="button" on:click={addNode(nodeType)}
			><span><Icon src={nodeIcons[nodeType] || ChevronRight} size="32" /></span>
			<span class="flex flex-col items-start text-left">
				<span>{nodeInfo[nodeType]?.title ?? nodeType}</span>
				<span class="text-xs opacity-80">{nodeInfo[nodeType]?.description ?? ''}</span>
			</span>
		</button>
	{/each}
</div>

<style>
	.context-menu button:hover {
		@apply bg-tertiary-700;
	}

	.btn-group-vertical > button {
		@apply justify-start;
	}
</style>
