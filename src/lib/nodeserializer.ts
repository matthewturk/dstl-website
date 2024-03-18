import type { Node, Edge } from "@xyflow/svelte"

export async function serializeGraphToJSON(nodes: Node[], edges: Edge[]): Promise<string> {
    const v = JSON.stringify({edges, nodes}, (key, value) => {
        if (key === 'columns') {
            return [];
        } else if (key === 'values') {
            return [];
        }
        return value;
    }, 2);
return v
}

export async function loadGraphFromJSON(nodes: Node[], edges: Edge[], jsonInput: string) {
    console.log(jsonInput);
    const graph = JSON.parse(jsonInput);
    const nodesToAdd = graph.nodes;
    const edgesToAdd = graph.edges;
    edges.splice(0, edges.length);  // clear the array
    nodes.splice(0, nodes.length);  // clear the array
    for (const node of nodesToAdd) {
        nodes.push(node);
    }
    for (const edge of edgesToAdd) {
        edges.push(edge);
    }
}