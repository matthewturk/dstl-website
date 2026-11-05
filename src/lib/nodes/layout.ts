import type { Node, Edge } from '@xyflow/svelte';
import { get, type Writable } from 'svelte/store';

// Default size (in pixels) of each kind of block. Tweak these if a block looks too big or small.
export const NODE_SIZES: Record<string, { width: number; height: number }> = {
	uploadNode: { width: 300, height: 230 },
	propertiesNode: { width: 600, height: 400 },
	spreadsheetNode: { width: 640, height: 520 },
	sortNode: { width: 320, height: 240 },
	aggregateNode: { width: 600, height: 540 },
	graphWrapperNode: { width: 660, height: 540 }
};
const FALLBACK = { width: 420, height: 320 };
const GAP_X = 140; // space between columns
const GAP_Y = 60; // space between blocks in the same column

export function sizeFor(type?: string | null) {
	return (type && NODE_SIZES[type]) || FALLBACK;
}

/**
 * Arranges blocks left-to-right in the order data flows through them:
 * column 0 = blocks with no input (Upload), column 1 = blocks fed by column 0, and so on.
 * Blocks in the same column are stacked top to bottom, and every column is centred vertically.
 */
export function tidyLayout(nodes: Node[], edges: Edge[]): Node[] {
	const ids = new Set(nodes.map((n) => n.id));
	const parents = new Map<string, string[]>();
	for (const e of edges) {
		if (!ids.has(e.source) || !ids.has(e.target)) continue;
		parents.set(e.target, [...(parents.get(e.target) ?? []), e.source]);
	}

	const cache = new Map<string, number>();
	function depthOf(id: string, trail: Set<string>): number {
		const known = cache.get(id);
		if (known !== undefined) return known;
		if (trail.has(id)) return 0; // guards against loops
		trail.add(id);
		const ps = parents.get(id) ?? [];
		const d = ps.length ? 1 + Math.max(...ps.map((p) => depthOf(p, trail))) : 0;
		trail.delete(id);
		cache.set(id, d);
		return d;
	}

	const columns: Node[][] = [];
	for (const n of nodes) {
		const d = depthOf(n.id, new Set());
		if (!columns[d]) columns[d] = [];
		columns[d].push(n);
	}

	const w = (n: Node) => n.width ?? sizeFor(n.type).width;
	const h = (n: Node) => n.height ?? sizeFor(n.type).height;
	const positions = new Map<string, { x: number; y: number }>();
	let x = 0;
	for (const col of columns) {
		if (!col) continue;
		const colWidth = Math.max(...col.map(w));
		const totalHeight = col.reduce((sum, n) => sum + h(n), 0) + GAP_Y * (col.length - 1);
		let y = -totalHeight / 2;
		for (const n of col) {
			positions.set(n.id, { x, y });
			y += h(n) + GAP_Y;
		}
		x += colWidth + GAP_X;
	}

	return nodes.map((n) => ({
		...n,
		width: w(n),
		height: h(n),
		position: positions.get(n.id) ?? n.position
	}));
}

export function applyTidy(
	nodes: Writable<Node[]>,
	edges: Writable<Edge[]>,
	fitView?: (options?: Record<string, unknown>) => void
) {
	const current = get(nodes);
	if (!current.length) return;
	nodes.set(tidyLayout(current, get(edges)));
	if (fitView) setTimeout(() => fitView({ padding: 0.1, maxZoom: 1, duration: 400 }), 150);
}
