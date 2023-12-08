<script lang="ts">
  import { FileButton } from "@skeletonlabs/skeleton";
  let files: FileList = [];
  let jsonDataArray = []; // Store JSON data

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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const jsonData = await parseCSVToJson(file);
      jsonDataArray.push(jsonData);
    }
    displayJsonData(); // Display JSON data
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