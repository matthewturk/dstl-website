<script lang="ts">
	import MarkdownContent from '$lib/MarkdownContent.svelte';
	import * as Papa from 'papaparse';
	import { FileButton } from '@skeletonlabs/skeleton';
	import JSONTree from 'svelte-json-tree';
	import { Line, Scatter, Bar } from 'svelte-chartjs';
	//import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
	import 'chart.js/auto';
	import type { ChartData, ChartDataset } from 'chart.js';
	import DataProcessor from '$lib/nodes/DataProcessor.svelte';
	//borderColor: 'rgba(75, 192, 192, 1)',

	let plotType = "line";
	let files: FileList;
	let value: IValueArray[] = [];
	let fields: string[] = [];
	let dataToPlot: ChartData<any, number[]> = { labels: [], datasets: [] };
	let xColumn = ''; // Selected column for X-axis
	let yColumn = ''; // Selected column for Y-axis

	interface IValueArray{
		[key: string]: number;
	}

	const parseCSV = (file: File): Promise<Papa.ParseResult<any>> => {
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				complete: resolve,
				dynamicTyping: true,
				header: true,
				error: reject
			});
		});
	};

	$: {
		dataToPlot = {
			labels: value.map((e) => e[xColumn]),
			datasets: [{ label: yColumn, data: value.map(e => e[yColumn]) }]
		};
	}

	async function parseFile() {
		console.log(files[0]);

		let results: Papa.ParseResult<any>;
		try {
			results = await parseCSV(files[0]);
		} catch (error) {
			console.error('Error:', error);
			return;
		}

		fields = [...(results.meta.fields || [])];
		value = [...results.data];
	}
</script>

<MarkdownContent pagename="datasets">
	<div class="w-5/6 grid grid-cols-2">
		<div class="p-4 m-4 flex objects-top">
			<FileButton name="file" multiple="false" bind:files on:change={parseFile} />
			<select id="plotType" bind:value={plotType}>
				<option value="line">Line</option>
				<option value="scatter">Scatter</option>
				<option value="bar">Bar</option>
			</select>
		</div>
		<div id="json-data-display" class="p-4 m-4 flex objects-top">
			<JSONTree {value} />
		</div>
	</div>
	<div class="w-5/6 h-full bg-white">
	<DataProcessor/>
	</div>
	<div class="w-5/6 bg-surface-500">
		{#if value.length > 0}
			<label for="xcol">Select X-axis Column: </label>
			<select id="xcol" bind:value={xColumn}>
				{#each fields as field}
					<option value={field}>{field}</option>
				{/each}
			</select>

			<label for="ycol">Select Y-axis Column: </label>
			<select id="ycol" bind:value={yColumn}>
				{#each fields as field}
					<option value={field}>{field}</option>
				{/each}
			</select>
		{/if}
	</div>

	{#if plotType == "line"}
	<Line class="w-5/6 bg-white h-32" options={{responsive:true}} data={dataToPlot} />
	{:else if plotType == "scatter"}
	<Scatter class="w-5/6 bg-white h-32" options={{responsive:true}} data={dataToPlot} />
	{:else if plotType == "bar"}
	<Bar class="w-5/6 bg-white h-32" options={{responsive:true}} data={dataToPlot} />
	{:else}
		<p>Plot type not supported</p>
	{/if}
</MarkdownContent>
