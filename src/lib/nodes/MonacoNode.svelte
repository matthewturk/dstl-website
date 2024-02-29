<script lang="ts" context="module">
	import { DocumentText } from '@steeze-ui/heroicons';
	export const icon = DocumentText;
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
	//export let columns: $$Props['columns'];
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let model: Monaco.editor.IModel;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;
	let language: string = 'json';

	onMount(async () => {
		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('../monaco')).default;

		// Your monaco instance is ready, let's display some code!
		editor = monaco.editor.create(editorContainer, { automaticLayout: true });
		model = monaco.editor.createModel(
			"console.log('Hello from Monaco! (the editor, not the city...)')",
			'javascript'
		);
		editor.setModel(model);
	});
	$: {
		if (monaco && editor && model) {
			monaco.editor.setModelLanguage(model, language);
		}
	}

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<NodeWrapper {id} label="Editor" {icon} resizable={true}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<Handle type="source" position={Position.Right} {isConnectable} />
	<div class="flex flex-col h-full w-full">
		<select class="flex-none w-auto p-2 m-2" bind:value={language}>
			<option value="javascript">javascript</option>
			<option value="python">python</option>
			<option value="json">json</option>
            <option value="markdown">markdown</option>
		</select>
		<div class="flex-1 min-w-0 min-h-0 p-2 m-2">
			<div style="width: 100%; height: 100%;" bind:this={editorContainer} />
		</div>
	</div>
</NodeWrapper>
