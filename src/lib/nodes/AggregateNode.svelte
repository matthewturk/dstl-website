<script lang="ts" context="module">
	import { ArrowRightEndOnRectangle } from '@steeze-ui/heroicons';
	export const icon = ArrowRightEndOnRectangle;
</script>

<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { AggregationType } from './constants';
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
	const { aggregationType, column } = data;
</script>

<NodeWrapper label="Aggregate {$column || ''}" {icon}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<select
		id="aggregationType"
		value={$aggregationType}
		on:input={(event) => {
			$aggregationType = event.currentTarget.value;
		}}
	>
		{#each Object.values(AggregationType) as type}
			<option value={type}>{type}</option>
		{/each}
	</select>
</NodeWrapper>
