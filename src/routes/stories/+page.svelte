<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Vega, View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	let visible: boolean = true;

	let data = {
		table: [
			{ library: 'A', op_income: 644506, program_attendance: 1315, visitors: 5144, programs_offered: 36, 
public_computer_use: 5, service_hours: 1928, website_visits: 9006, registered_borrowers: 817, automated_system: 3},
			{ library: 'B', op_income: 112855, program_attendance: 976, visitors: 3132, programs_offered: 32, 
public_computer_use: 6, service_hours: 1196, website_visits: 874, registered_borrowers: 1143, automated_system: 1},
			{ library: 'C', op_income: 58461, program_attendance: 339, visitors: 2602, programs_offered: 21, 
public_computer_use: 6, service_hours: 0, website_visits: 1715, registered_borrowers: 1067, automated_system: 2},
			{ library: 'D', op_income: 33194, program_attendance: 0, visitors: 1954, programs_offered: 0, 
public_computer_use: 2, service_hours: 1090, website_visits: 0, registered_borrowers: 185, automated_system: 0},
			{ library: 'E', op_income: 39817, program_attendance: 675, visitors: 2983, programs_offered: 16, 
public_computer_use: 4, service_hours: 1040, website_visits: 1300, registered_borrowers: 520, automated_system: 1},
			{ library: 'F', op_income: 40841, program_attendance: 348, visitors: 2275, programs_offered: 80, 
public_computer_use: 4, service_hours: 1092, website_visits: 1123, registered_borrowers: 430, automated_system: 1},
			{ library: 'G', op_income: 49556, program_attendance: 1453, visitors: 4543, programs_offered: 111, 
public_computer_use: 1, service_hours: 1300, website_visits: 736, registered_borrowers: 543, automated_system: 3},
			{ library: 'H', op_income: 55531, program_attendance: 301, visitors: 2911, programs_offered: 47, 
public_computer_use: 2, service_hours: 800, website_visits: 2534, registered_borrowers: 685, automated_system: 2}
		]
	};
	let spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'A simple bar chart with embedded data.',
		data: {
			name: 'table'
		},
		mark: 'bar',
		encoding: {
			x: { field: 'library', type: 'nominal' },
			y: { field: 'op_income', type: 'quantitative' }
		}
	};

    function updateSpec(): void {
        console.log("Hi");
        spec.title = "new title";
        data.table[0].op_income = 129340;
        data = {table: []};
        console.log(myView);
    }
    let myView: View;
</script>

{#if visible}
	<aside class="alert variant-filled-error" transition:fade={{ duration: 200 }}>
		<!-- Icon -->
		<div>(icon)</div>
		<!-- Message -->
		<div class="alert-message">
			<h3 class="h3">(title)</h3>
			<p>You don't have any stories yet.</p>
		</div>
		<!-- Actions -->
		<div class="alert-actions">(buttons)</div>
	</aside>
{/if}

<VegaLite bind:view={myView} bind:data={data} bind:spec={spec}/>
<button on:click={updateSpec}>click me</button>
