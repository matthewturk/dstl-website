<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	import {
		Controls,
		ControlButton,
	} from '@xyflow/svelte';

	import { ArrowDownTray } from '@steeze-ui/heroicons';
	import { ArrowUpTray } from '@steeze-ui/heroicons';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
    export let saveNodes: () => void;
    export let loadNodes: () => void;
</script>

<Controls>
	<ControlButton on:click={loadNodes}>
		<Icon size="1.25rem" src={ArrowUpTray} />
	</ControlButton>
	<ControlButton on:click={saveNodes}>
		<Icon size="1.25rem" src={ArrowDownTray} />
	</ControlButton>
</Controls>
