import type { Node, Edge } from "@xyflow/svelte"

export async function serializeGraphToJSON(nodes: Node[], edges: Edge[]): Promise<string> {
    const v = JSON.stringify({edges, nodes}, (key, value) => {
        if (key === 'columns') {
            return [];
        } else if (key === 'values') {
            return [];
        } else if (key === 'selected') {
            console.log("Changing selected to false");
            return false;
        }
        return value;
    }, 2);
return v
}

export async function loadGraphFromJSON(nodes: Node[], edges: Edge[], jsonInput: string) {
}