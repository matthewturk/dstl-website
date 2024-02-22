<script lang="ts">
	// Borrowed from https://github.com/data-exp-lab/CodeBurl/blob/main/src/routes/nodes/NodeWrapper.svelte
	import { NodeResizer, NodeToolbar, Position } from '@xyflow/svelte';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import { DocumentDuplicate, Trash, ArrowsPointingOut, ArrowsPointingIn } from '@steeze-ui/heroicons';
	export let icon: IconSource;
	export let label: string;
	export let resizable: boolean = false;
	export let toolbar: boolean = true;
	export let expanded: boolean = false;
</script>

{#if resizable}
	<NodeResizer minWidth={100} minHeight={60} />
{/if}
{#if toolbar}
	<NodeToolbar position={Position.Top} align="start">
		<button type="button" class="btn-icon btn-icon-sm variant-filled"><Icon size="1.25rem" src="{Trash}"/></button>
		<button type="button" class="btn-icon btn-icon-sm variant-filled"><Icon size="1.25rem" src="{DocumentDuplicate}"/></button>
		<button type="button" class="btn-icon btn-icon-sm variant-filled"><Icon size="1.25rem" src="{expanded ? ArrowsPointingIn : ArrowsPointingOut}"/></button>
	</NodeToolbar>
{/if}


<div
	class="flex flex-col border w-full border-solid border-gray-200 h-full rounded-2xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]"
>
	<div
		class="text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-2xl family-mono text-[#0F172A]"
	>
	 <div class="flex align-bottom place-items-center">
		{#if icon}<span class="mr-2"><Icon size="1rem" src={icon}/></span>{/if}<span>{label}</span>
		</div>
	</div>
	<div
		class="relative bg-white p-3 h-full flex rounded-b-2xl family-sans text-xs"
	>
		<slot />
	</div>
</div>
