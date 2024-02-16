<script lang="ts">
    import { useNodes, type NodeTypes } from '@xyflow/svelte';

    export let nodeTypes: NodeTypes;
    export let onClick: (e: MouseEvent) => void;
    export let left: number | undefined;
    export let top: number | undefined;
    export let right: number | undefined;
    export let bottom: number | undefined;

    const nodes = useNodes();

    function addNode(nodeType: string) {
      console.log("Hi", nodeType);
        $nodes.push({
            id: Math.random().toString(36).substring(7),
            type: nodeType,
            position: {
                x: Math.random() * 100,
                y: Math.random() * 100
            },
            data: {}
        })
    }
</script>

<div
  style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
  class="context-menu absolute z-10"
  on:click={onClick}
>
  {#each Object.keys(nodeTypes) as nodeType}
    <button on:click={addNode(nodeType)}>Add {nodeType.slice(0, -4) || ""}</button>
  {/each}
</div>

<style>
    .context-menu {
      background: white;
      border-style: solid;
      box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
      z-index: 10;
    }
  
    .context-menu button {
      border: none;
      display: block;
      padding: 0.5em;
      text-align: left;
      width: 100%;
    }
  
    .context-menu button:hover {
      background: white;
    }
  </style>