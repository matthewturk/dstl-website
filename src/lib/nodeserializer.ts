import type { Node } from "@xyflow/svelte"

export async function serializeNodesToJSON(nodes: Node[]) {
    const v = JSON.stringify(nodes, (key, value) => {
        if (key === 'columns') {
            return [];
        } else if (key === 'values') {
            return [];
        }
        return value;
    }, 2);
    console.log(v);
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