<script>
  import { writable } from 'svelte/store';
  import { Render, Subscribe, createTable, createRender, DataBodyRow } from 'svelte-headless-table';
  import { createSamples } from './createSamples';
  import EditableCell from './EditableCell.svelte';

  const data = writable(createSamples(5));
  const updateData = (rowDataId, columnId, newValue) => {
    if (['oeprating_income', 'operating_expenditures'].includes(columnId)) {
      newValue = parseInt(newValue);
      if (isNaN(newValue)) {
        // Refresh data to reset invalid values.
        $data = $data;
        return;
      }
    }
    if (columnId === 'facStatus') {
      if (!['Good', 'Poor', 'Fair', 'Average'].includes(newValue)) {
        // Refresh data to reset invalid values.
        $data = $data;
        return;
      }
    }
    // In this case, the dataId of each item is its index in $data.
    // You can also handle any server-synchronization necessary here.
    const idx = parseInt(rowDataId);
    const currentItem = $data[idx];
    const key = columnId; // Cast as `keyof YourDataItem`
    const newItem = {...currentItem, [key]: newValue};
    console.log(newItem);
    $data[idx] = newItem;
    $data = $data;
    // Handle any server-synchronization.
  }

  const table = createTable(data);
	
	const EditableCellLabel /*: DataLabel<Sample>*/ = ({ column, row, value }) =>
    createRender(EditableCell, {
      row,
      column,
      value,
      onUpdateValue: updateData,
    })

  const columns = table.createColumns([
    table.group({
      header: 'Libraries',
      columns: [
        table.column({
          header: 'Library Name',
          cell: EditableCellLabel,
          accessor: 'libName',
        }),
        table.column({
          header: () => 'Facility Status',
          cell: EditableCellLabel,
          accessor: 'facStatus',
        }),
      ],
    }),
		table.group({
      header: 'Service',
      columns: [
        table.column({
          header: 'Annual Visits',
          cell: EditableCellLabel,
          accessor: 'annualVisits',
        }),
        table.column({
          header: 'Website Visits',
          cell: EditableCellLabel,
          accessor: 'websiteVisits',
        }),
				table.column({
          header: 'Registered Borrowers',
          cell: EditableCellLabel,
          accessor: 'registeredBorrowers',
        }),
      ],
    }),
    table.group({
      header: 'Financial',
      columns: [
        table.column({
          header: 'Operating Income',
          cell: EditableCellLabel,
          accessor: 'operating_income',
        }),
        /*table.column({
          header: 'Operating Expenditures',
          cell: EditableCellLabel,
          id: 'status',
          accessor: (item) => item.status,
        }), */
        table.column({
          header: 'Operating Expenditures',
          cell: EditableCellLabel,
          accessor: 'operating_expenditures',
        }),
        /*table.column({
          header: 'Profile Progress',
          cell: EditableCellLabel,
          accessor: 'progress',
        }),*/
      ],
    }),
		table.group({
      header: 'Program',
      columns: [
        table.column({
          header: 'For Kids',
          cell: EditableCellLabel,
          accessor: 'proKids',
        }),
        table.column({
          header: 'For Teens',
          cell: EditableCellLabel,
          accessor: 'proTeens',
        }),
				table.column({
          header: 'For Adults',
          cell: EditableCellLabel,
          accessor: 'proAdults',
        }),
				table.column({
          header: 'For General Audience',
          cell: EditableCellLabel,
          accessor: 'proGeneral',
        }),
      ],
    }),
		table.group({
      header: 'Technology',
      columns: [
        table.column({
          header: 'Database Usage',
          cell: EditableCellLabel,
          accessor: 'database',
        }),
        table.column({
          header: 'Public Computers',
          cell: EditableCellLabel,
          accessor: 'computers',
        }),
				table.column({
          header: 'WIFI Usage',
          cell: EditableCellLabel,
          accessor: 'wifi',
        }),
      ],
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

	import { scaleLinear } from 'd3-scale';

	const points = [
		{ year: 1990, birthrate: 16.7 },
		{ year: 1995, birthrate: 14.6 },
		{ year: 2000, birthrate: 14.4 },
		{ year: 2005, birthrate: 14 },
		{ year: 2010, birthrate: 13 },
		{ year: 2015, birthrate: 12.4 }
	];

	const xTicks = [1990, 1995, 2000, 2005, 2010, 2015];
	const yTicks = [0, 5, 10, 15, 20];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<div class="overflow-x-auto">
  <table {...$tableAttrs} class="demo">
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe attrs={headerRow.attrs()} let:attrs>
          <tr {...attrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <th {...attrs}>
                  <div>
                    <Render of={cell.render()} />
                  </div>
                </th>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </thead>
    <tbody {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe attrs={row.attrs()} let:attrs>
          <tr {...attrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <td {...attrs}>
                  <Render of={cell.render()} />
                </td>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </tbody>
  </table>
</div>
<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%" />
					<text y="-4">{tick} {tick === 20 ? ' per 1,000 population' : ''}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each points as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x={barWidth / 2} y="-4">{width > 380 ? point.year : formatMobile(point.year)}</text>
				</g>
			{/each}
		</g>

		<g class="bars">
			{#each points as point, i}
				<rect
					x={xScale(i) + 2}
					y={yScale(point.birthrate)}
					width={barWidth - 4}
					height={yScale(0) - yScale(point.birthrate)}
				/>
			{/each}
		</g>
	</svg>
</div>

<style>
	table {
		border-spacing: 0;
		border-top: 1px solid black;
		border-left: 1px solid black;
	}
	th, td {
		border-bottom: 1px solid black;
		border-right: 1px solid black;
		padding: 0.5rem;
	}

	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #a11;
		stroke: none;
		opacity: 0.65;
	}
</style>
