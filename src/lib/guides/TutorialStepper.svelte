<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { useSvelteFlow, useNodes } from '@xyflow/svelte';
	import { michiganLibraryDataString } from '$lib/exampledata';
	import type { Writable } from 'svelte/store';
	import * as aq from 'arquero';

	import '@xyflow/svelte/dist/style.css';
	import 'tailwindcss/tailwind.css';

	// Shared with GuidelinesPanel so "Skip", "Complete" and the X button all close the same panel
	export let visible: Writable<boolean>;

	function closePanel() {
		visible.set(false);
	}

	const { updateNodeData, fitView } = useSvelteFlow();
	const nodes = useNodes();

	let currentStep = -1;

	// Which blocks the canvas zooms to on each step (steps not listed show everything)
	const stepFocus: Record<number, string[]> = {
		2: ['uploadNode'],
		3: ['propertiesNode'],
		4: ['spreadsheetNode'],
		6: ['uploadNode', 'aggregateNode'],
		7: ['aggregateNode'],
		8: ['aggregateNode', 'graphWrapperNode']
	};

	function focusStep(step: number) {
		const types = stepFocus[step];
		const targets = types
			? $nodes.filter((n) => n.type && types.includes(n.type)).map((n) => ({ id: n.id }))
			: [];
		setTimeout(
			() =>
				fitView({
					nodes: targets.length ? targets : undefined,
					padding: 0.15,
					maxZoom: 1,
					duration: 500
				}),
			50
		);
	}

	function updateStep(e: {
		detail: { state: { current: number; total: number }; step: number };
	}): void {
		currentStep = e.detail.state.current;
		focusStep(currentStep);
	}

	async function useSampleData() {
		const table = await aq.fromCSV(michiganLibraryDataString);
		const upload = $nodes.find((n) => n.type === 'uploadNode');
		if (upload) updateNodeData(upload.id, { inputTable: table });
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

<Stepper class="text-token" gap="gap-1" on:step={updateStep} on:complete={closePanel}>
	<Step>
		<svelte:fragment slot="header">Welcome!</svelte:fragment>
		<p>
			DSTL helps you turn your library's spreadsheet data into charts you can use in reports and
			stories. No coding needed.
		</p>
		<p>
			This short tour takes about five minutes. You'll load some data, look at it, and draw a
			chart.
		</p>
		<button type="button" class="btn variant-filled-secondary" on:click={closePanel}
			>Skip the tour</button
		>
	</Step>
	<Step>
		<svelte:fragment slot="header">How it works</svelte:fragment>
		<p>
			The workspace on the right is made of <i>blocks</i>. Each block does one job, such as
			loading data, summarizing it, or drawing a chart.
		</p>
		<p>
			Blocks are connected from left to right. Your data flows along the lines from one block to
			the next.
		</p>
		<p>Let's meet the first block.</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Load your data</svelte:fragment>
		<p>Start with the highlighted <i>Upload Data</i> block. It reads a CSV file, which is a spreadsheet saved as comma-separated values.</p>
		<p>Your file stays on your computer. Nothing is sent to a server.</p>
		<p>
			No file handy? Use our sample: public library data from Michigan (2020-2021). The rest of the
			tour uses it.
		</p>
		<button type="button" class="btn variant-filled-secondary" on:click={useSampleData}
			>Use the sample data</button
		>
	</Step>
	<Step>
		<svelte:fragment slot="header">Check your columns</svelte:fragment>
		<p>
			The <i>Column Summary</i> block lists every column in your data and shows, for each one, the smallest
			and largest value, the average (for numbers), how many rows are filled in, and how many different
			values appear.
		</p>
		<p>It's a quick way to spot gaps or surprises before you build anything.</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Browse your rows</svelte:fragment>
		<p>
			The <i>Data Table</i> block shows your rows. Search, filter, sort by clicking a column heading,
			and page through the results.
		</p>
		<p>
			The table is view-only for now. If you make any changes in your spreadsheet, please upload
			it again to see them here.
		</p>
	</Step>
	<Step locked={nodeAddLock}>
		<svelte:fragment slot="header">Add more blocks</svelte:fragment>
		<p>Right-click an empty spot in the workspace to see the blocks you can add.</p>
		<p>
			Add a <i>Group &amp; Summarize</i> block and a <i>Chart</i> block. Once both are on the
			workspace, the Next button unlocks. Blocks line up automatically.
		</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Connect your data</svelte:fragment>
		<p>
			We want to see how many people libraries serve, grouped by library size class. First, send
			your data to the <i>Group &amp; Summarize</i> block.
		</p>
		<p>
			Every block has connection dots. Data leaves through the dot on a block's right edge and
			enters through the dot on its left edge. When your mouse is over a dot, the cursor turns
			into a + sign.
		</p>
		<p>
			Drag from the dot on the right of <i>Upload Data</i> to the dot on the left of
			<i>Group &amp; Summarize</i>.
		</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Summarize</svelte:fragment>
		<p>In the <i>Group &amp; Summarize</i> block:</p>
		<p>
			1. Set <b>Group rows by</b> to <b>Library Class</b>.<br />
			2. Set <b>Calculate</b> to <b>Total (sum)</b>.<br />
			3. Click <b>Total Population Served</b> to select it.<br />
			4. Press <b>Apply</b>.
		</p>
		<p>
			Column Summary and Data Table will still show your original data, because they are
			connected to Upload Data. The grouped result appears in the Chart, which we connect next.
		</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Draw a chart</svelte:fragment>
		<p>
			Drag from the dot on the right of <i>Group &amp; Summarize</i> (not Upload Data) to the dot on
			the left of the <i>Chart</i> block.
		</p>
		<p>
			Choose <b>Bar</b>, set <b>X-axis</b> to <b>Library Class</b> and <b>Y-axis</b> to
			<b>Total Population Served</b>. You'll see how many people each class of library serves.
		</p>
		<p>
			Tip: hover over the small buttons to see what they do. In the bottom-left corner, + and −
			zoom in and out. Click a block to show its buttons above it: delete, copy and expand. Hover
			over a bar or point in the chart to see its category and value.
		</p>
	</Step>
	<Step>
		<svelte:fragment slot="header">Explore!</svelte:fragment>
		<p>That's the tour. Now try your own CSV file, or experiment with other columns and charts.</p>
		<p>
			DSTL is still a prototype. Planned next: more ways to summarize data, ready-made analyses
			for common library datasets, guided story templates, and Python for advanced users.
		</p>
		<p>
			You can reopen this tour any time with the ? button in the bottom-left corner of the
			workspace.
		</p>
	</Step>
</Stepper>
