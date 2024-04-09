<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { Panel, useSvelteFlow, useNodes } from '@xyflow/svelte';
	import { michiganLibraryDataString } from '$lib/exampledata';
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
		const table = await aq.fromCSV(michiganLibraryDataString);
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
	$: nodeAddLock = !(graphNode && aggregateNode);
</script>

{#if visible}
	<Stepper
		class="absolute w-full text-token card p-4 m-4"
		on:step={updateStep}
		on:complete={closePanel}
	>
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
				This allows you to "upload" a CSV, or comma-separated value, file. But, it never leaves your
				computer! Everything will happen right here in the browser, and your data will never have to
				reach our server.
			</p>
			<p>
				If you'd like, you can click here to <i>simulate</i>
				uploading a file. The rest of the tutorial will assume you are using this data.
			</p>
			<p>
				This data is a subset of the library data from Michigan Public Libraries from 2020-2021.
			</p>
			<button type="button" class="btn variant-filled-secondary" on:click={useSampleData}
				>Upload for me!</button
			>
		</Step>
		<Step>
			<svelte:fragment slot="header">Examining Data</svelte:fragment>
			<p>
				Next up, we can use the <i>Properties</i> node to take a look at the characteristics of our dataset.
			</p>
			<p>
				This will tell you some of the characteristics, most importantly the columns and the number
				of rows in each column.
			</p>
			<p>
				Each column is represented as a line in the box, and to its right are a few characteristics.
				You can see the minimum value in that column, the maximum value in that column, the average
				(if applicable) and both the total number of elements in that column <i>and</i> the number of
				unique elements.
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Digging Into Data</svelte:fragment>
			<p>Also available for detailed data inspection is the <i>Spreadsheet</i> node.</p>
			<p>
				While not currently functional for editing data, you can use it to inspect the uploaded
				values.
			</p>
			<p>Until then, you can always go back to your data, make corrections, and upload again.</p>
		</Step>
		<Step locked={nodeAddLock}>
			<svelte:fragment slot="header">Adding New Nodes</svelte:fragment>
			<p>
				New nodes are available for you to add as well! You can see what is available by
				right-clicking on the blank space where the nodes live.
			</p>
			<!--<p>Right now, the Python and Monaco nodes don't do much, but they're under development.</p>-->
			<p>
				For now, go ahead and add a <i>Graph Wrapper</i> node and an
				<i>Aggregate</i> node. Once you've added them, you can move to the next step.
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Aggregating Data</svelte:fragment>
			<p>
				The first thing we want to do is to aggregate our data, so that we can try to say something
				about the dataset as a whole.
			</p>
			<p>
				For instance, it would be useful to understand how membership is distributed as a function
				of the library class.
			</p>
			<p>
				If you look closely, on the right hand side of the "Upload" node you'll notice that there's
				a little ring. That's the <i>output handle</i> -- it's where the data comes out of the node.
				Most nodes also have an input handle, on the left hand side, where the data comes
				<i>into</i> the node.
			</p>
			<p>
				Click on the output handle on the right side of the <i>Upload</i> node and drag it to handle
				on the left side of the <i>Aggregate</i> node.
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Processing Data</svelte:fragment>
			<p>
				Now, we want to group our data by the "Library Class" column. So, choose that from the
				"Group By" dropdown.
			</p>
			<p>
				Then, choose the fields you want to operate on, and the operations you'd like to do. Select
				"sum" and click on the "Total Population Served" item to choose the field to which this
				operation will apply.
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Making a Graph</svelte:fragment>
			<p>
				Now, drag from the output handle to the input handle of the <i>Graph</i> node, and click
				<i>Process</i> on the Aggregate node. (If you have a hard time finding the Graph node that you
				added a few steps ago, it might be hidden under other nodes.)
			</p>
			<p>
				Once you've connected these nodes, the processed data will flow between them. Let's make a
				"Bar" chart, and for our X-axis let's choose "Library Class." For our y-axis, we'll choose
				"Total Population Served."
			</p>
			<p>
				The chart will automatically update, and we can see how the served population is distributed
				among different classes of library in Michigan.
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Explore!</svelte:fragment>
			<p>
				And that completes the tutorial for this <i>prototype</i> of the DSTL data viz dashboard.
			</p>
			<p>
				We've got lots of plans in store -- including more complex aggregation, "canned" analysis of
				common datasets, walkthroughs for common story forms, and even Python code execution for
				digging really deeply.
			</p>
			<p>Stay tuned!</p>
		</Step>
	</Stepper>
{/if}
