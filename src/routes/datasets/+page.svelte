<script lang="ts">
  import {FileButton} from "@skeletonlabs/skeleton";
  let files: FileList = [];
</script>

<FileButton name="files" multiple=true bind:files={files} />

You have selected:<ul>
{#each files as thisFile}
  <li>{thisFile}</li>
  {console.log(thisFile)}
  {/each}
</ul>