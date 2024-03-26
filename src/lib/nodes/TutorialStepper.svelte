<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { Panel, useSvelteFlow, useNodes } from '@xyflow/svelte';
	import { csvString } from '$lib/exampledata';
	import * as aq from 'arquero';

	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';
	let visible = true;

	function closePanel() {
		visible = false;
	}

	const { updateNodeData } = useSvelteFlow();
	const nodes = useNodes();

	let currentStep = -1;

	function updateStep(e: {
		detail: { state: { current: number; total: number }; step: number };
	}): void {
		currentStep = e.detail.state.current;
	}

	async function useSampleData() {
		const table = await aq.fromCSV(csvString);
		console.log('Table');
		updateNodeData($nodes[0].id, { inputTable: table });
	}

	$: for (const node of $nodes) {
		switch (node.type) {
			case 'uploadNode':
				updateNodeData(node.id, { highlighted: currentStep == 2 });
				break;
			case 'propertiesNode':
				updateNodeData(node.id, { highlighted: currentStep == 3 });
				break;
			case 'spreadsheetNode':
				updateNodeData(node.id, { highlighted: currentStep == 4 });
		}
	}

	let graphNode = false;
	let aggregateNode = false;
	let nodeAddLock = true;

	$: graphNode = $nodes.reduce((p, n) => p || n.type == 'graphWrapperNode', false);
	$: aggregateNode = $nodes.reduce((p, n) => p || n.type == 'aggregateNode', false);
    $: nodeAddLock = !(graphNode);// && aggregateNode);
</script>

{#if visible}
        <Stepper class="absolute w-full text-token card p-4 m-4" on:step={updateStep} on:complete={closePanel}>
			<Step>
				<svelte:fragment slot="header">Welcome!</svelte:fragment>
				<p>Welcome to the <i>prototype</i> DSTL visualization dashboard.</p>
				<p>Let's walk through how you might get started.</p>
				<button type="button" class="btn variant-filled-secondary" on:click={closePanel}
					>Skip the tutorial!</button
				>
			</Step>
			<Step>
				<svelte:fragment slot="header">What is this?</svelte:fragment>
				<p>
					This prototype demonstrates the ability to connect different <i>nodes</i> that represent
					stages in the development of a <i>data story</i>.
				</p>
				<p>These nodes can be connected to highlight and process data in different ways.</p>
				<p>Let's see what they can do!</p>
			</Step>
			<Step>
				<svelte:fragment slot="header">Uploading Data</svelte:fragment>
				<p>The first node to become familiar with is <i>Upload</i>.</p>
				<p>
					This allows you to "upload" a CSV, or comma-separated value, file. But, it never leaves
					your computer! Everything will happen right here in the browser, and your data will never
					have to reach our server.
				</p>
				<p>
					If you'd like, you can click here to <i>simulate</i>
					uploading a file. The rest of the tutorial will assume you are using this data.
				</p>
				<button type="button" class="btn variant-filled-secondary" on:click={useSampleData}
					>Upload for me!</button
				>
			</Step>
			<Step>
				<svelte:fragment slot="header">Examining Data</svelte:fragment>
				<p>
					Next up, we can use the <i>Properties</i> node to take a look at the characteristics of our
					dataset.
				</p>
				<p>
					This will tell you some of the characteristics, most importantly the columns and the
					number of rows in each column.
				</p>
			</Step>
			<Step>
				<svelte:fragment slot="header">Digging Into Data</svelte:fragment>
				<p>Also available for detailed data inspection is the <i>Spreadsheet</i> node.</p>
				<p>
					While not currently functional for editing data, you can use it to inspect the uploaded
					values.
				</p>
			</Step>
			<Step locked={nodeAddLock}>
				<svelte:fragment slot="header">Adding New Nodes</svelte:fragment>
				<p>
					New nodes are available for you to add as well! You can see what is available by
					right-clicking in the canvas.
				</p>
				<p>Right now, the Python and Monaco nodes don't do much, but they're under development.</p>
				<p>For now, go ahead and add a <i>Graph Wrapper</i> node.</p>
			</Step>
			<Step>
				<svelte:fragment slot="header">Making a Graph</svelte:fragment>
				<p>
					Now, let's go ahead and connect these two nodes. Click the <i>handle</i> on the right side
					of the <i>Upload</i> node and drag it to the handle on the left side of the <i>Graph</i> node.
				</p>
				<p>
					Once you've connected, change the graph to be a "Line" plot with the "Wavelength" on the
					x-axis and the "RedResponse" on the y-axis.
				</p>
				<p>This is the average response function of the human eye in the "R" cone!</p>
			</Step>
			<Step>
				<svelte:fragment slot="header">Explore!</svelte:fragment>
				<p>
					And that completes the tutorial for this <i>prototype</i> of the DSTL data viz dashboard.
				</p>
				<p>
					We've got lots of plans in store -- including more complex aggregation, "canned" analysis
					of common datasets, and walkthroughs for common story forms.
				</p>
			</Step>
		</Stepper>
{/if}
