<script lang="ts">
	// Invisible helper: whenever a block is added/removed or a line is connected/removed,
	// it re-arranges the blocks neatly. Dragging a block around does NOT trigger it.
	import { useNodes, useEdges, useSvelteFlow } from '@xyflow/svelte';
	import { tick } from 'svelte';
	import { applyTidy } from './layout';

	const nodes = useNodes();
	const edges = useEdges();
	const { fitView } = useSvelteFlow();

	let lastKey: string | null = null;
	$: key =
		$nodes.map((n) => n.id).join(',') + '|' + $edges.map((e) => `${e.source}>${e.target}`).join(',');
	$: {
		if (lastKey === null) {
			lastKey = key;
		} else if (key !== lastKey) {
			lastKey = key;
			tick().then(() => applyTidy(nodes, edges, fitView));
		}
	}
</script>
