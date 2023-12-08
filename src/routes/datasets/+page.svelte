
<script lang="ts">
  import { FileButton } from "@skeletonlabs/skeleton";
  let files: FileList = [];
  let jsonDataArray = []; // Store JSON data
  let xColumn = ""; // Selected column for X-axis
  let yColumn = ""; // Selected column for Y-axis
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
        },
      });
    });
  }

  async function convertFilesToJson() {
    jsonDataArray = []; // Reset previous data
    xColumns = []; // Reset X-axis columns
    yColumns = []; // Reset Y-axis columns

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const jsonData = await parseCSVToJson(file);
      jsonDataArray.push(jsonData);
    }

    if (jsonDataArray.length > 0) {
      const columns = Object.keys(jsonDataArray[0][0] || {});
      xColumns = columns;
      yColumns = columns;
    }
    displayJsonData()
  }

  function displayJsonData() {
    const jsonDataDisplay = document.getElementById("json-data-display");
    jsonDataDisplay.innerHTML = ""; // Clear previous content
    jsonDataArray.forEach((data, index) => {
      const jsonDataElement = document.createElement("pre");
      jsonDataElement.textContent = `File ${index + 1}: \n${JSON.stringify(data, null, 2)}`;
      jsonDataDisplay.appendChild(jsonDataElement);
    });
  }

  function visualizeData() {
    if (xColumn && yColumn) {
      const canvas = document.getElementById("chartCanvas");
      const ctx = canvas.getContext("2d");

      const data = {
        labels: jsonDataArray[0].map((item) => item[xColumn]),
        datasets: [
          {
            label: yColumn,
            data: jsonDataArray[0].map((item) => item[yColumn]),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

      new Chart(ctx, {
        type: "bar", // Change chart type as needed (e.g., 'line', 'pie', 'radar', etc.)
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: xColumn,
              },
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: yColumn,
              },
            }],
          },
        },
      });
    }
  }
</script>

<FileButton name="files" multiple=true bind:files={files} on:change={convertFilesToJson} />

You have selected:
<ul>
  {#each files as thisFile}
    <li>{thisFile.name}</li>
  {/each}
</ul>

<div id="json-data-display">
  <!-- JSON data will be displayed here -->
</div>
<div>
  {#if jsonDataArray.length > 0}
    <label>Select X-axis Column: </label>
    <select bind:value={xColumn}>
      {#each xColumns as column}
        <option value={column}>{column}</option>
      {/each}
    </select>

    <label>Select Y-axis Column: </label>
    <select bind:value={yColumn}>
      {#each yColumns as column}
        <option value={column}>{column}</option>
      {/each}
    </select>

    <button on:click={visualizeData}>Visualize</button>
  {/if}
</div>

<canvas id="chartCanvas"></canvas>
