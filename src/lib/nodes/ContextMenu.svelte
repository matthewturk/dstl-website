<script lang="ts">
	import { useNodes, type NodeTypes, type NodeProps } from '@xyflow/svelte';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { ComponentType, SvelteComponent } from 'svelte';
	interface INodeTypeInfo {
		[key: string]: {
			component: ComponentType<SvelteComponent<NodeProps, any, any>>;
			icon: IconSource;
		};
	}

	export let nodeTypeInfo: INodeTypeInfo = {};
	export let onClick: (e: MouseEvent) => void;
	export let left: number | undefined;
	export let top: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;

	const nodes = useNodes();

	function addNode(nodeType: string) {
		$nodes.push({
			id: Math.random().toString(36).substring(7),
			type: nodeType,
			position: {
				x: (left || 0) + 5,
				y: (top || 0) + 5
			},
			data: {}
		});
	}
</script>

<div
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
	class="absolute z-10 btn-group-vertical text-left variant-filled-tertiary context-menu"
	on:click={onClick}
>
	{#each Object.entries(nodeTypeInfo) as [nodeType, { icon }]}
		<button class="text-left" on:click={addNode(nodeType)}
			><span><Icon src={icon} size="32" /></span>
			<span>Add {nodeType.slice(0, -4) || ''}</span>
		</button>
	{/each}
</div>

<style>

	.context-menu button:hover {
		@apply bg-tertiary-700;
	}
</style>
