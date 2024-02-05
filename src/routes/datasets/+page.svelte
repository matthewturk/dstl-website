<script lang="ts">
	import MarkdownContent from '$lib/MarkdownContent.svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import  JSONTree  from 'svelte-json-tree';
	let files: FileList = [];
	let jsonDataArray = []; // Store JSON data
  let value = [];
	let xColumn = ''; // Selected column for X-axis
	let yColumn = ''; // Selected column for Y-axis
	let xColumns: string[] = []; // Available X-axis columns
	let yColumns: string[] = []; // Available Y-axis columns

	async function parseCSVToJson(file) {
		return new Promise((resolve, reject) => {
			Papa.parse(file, {
				header: true,
				dynamicTyping: true,
				complete: (results) => {
					resolve(results.data);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	async function convertFilesToJson() {
		const newDataArray = []; // Reset previous data
		xColumns = []; // Reset X-axis columns
		yColumns = []; // Reset Y-axis columns

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const jsonData = await parseCSVToJson(file);
			newDataArray.push(jsonData);
		}

		if (jsonDataArray.length > 0) {
			const columns = Object.keys(newDataArray[0][0] || {});
			xColumns = columns;
			yColumns = columns;
		}
    value = [...newDataArray];
	}

	function visualizeData() {
		if (xColumn && yColumn && jsonDataArray.length > 0) {
			const canvas = document.getElementById('chartCanvas');
			canvas.width = 600; // Set desired width
			canvas.height = 400; // Set desired height
			const ctx = canvas.getContext('2d');

			const data = {
				labels: jsonDataArray[0].map((item) => item[xColumn]),
				datasets: [
					{
						label: yColumn,
						data: jsonDataArray[0].map((item) => item[yColumn]),
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1
					}
				]
			};

			new Chart(ctx, {
				type: 'bar',
				data: data,
				options: {
					responsive: false, // Disable responsiveness
					maintainAspectRatio: false
				}
			});
		}
	}
</script>

<MarkdownContent pagename="datasets">
	<div class="w-5/6 grid grid-cols-2">
		<div class="p-4 m-4 flex objects-top">
			<FileButton name="files" multiple="true" bind:files on:change={convertFilesToJson} />
		</div>

		<div id="json-data-display" class="p-4 m-4 flex objects-top">
			<JSONTree {value} />
		</div>
	</div>
	<div classs="w-5/6">
		{#if jsonDataArray.length > 0}
			<label for="xcol">Select X-axis Column: </label>
			<select id="xcol" bind:value={xColumn}>
				{#each xColumns as column}
					<option value={column}>{column}</option>
				{/each}
			</select>

			<label for="ycol">Select Y-axis Column: </label>
			<select id="ycol" bind:value={yColumn}>
				{#each yColumns as column}
					<option value={column}>{column}</option>
				{/each}
			</select>

			<button on:click={visualizeData}>Visualize</button>
		{/if}
	</div>

	<canvas id="chartCanvas" />
</MarkdownContent>
