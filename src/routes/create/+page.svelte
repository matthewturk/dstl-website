<script lang="ts">
	import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";

    const step1Options = [
        {icon: "needsassess.png", text: "Understand the real needs of their communities", value: "needsassess"},
        {icon: "meetneeds.png", text: "Serve the needs of their communities", value: "meetneeds"},
        {icon: "equitable.png", text: "Keep up with other libraries", value: "equitable"},
        {icon: "strength.png", text: "Build on existing strengths", value: "strengths"},
        {icon: "deficits.png", text: "Address deficits", value: "deficits"}
    ];
    let need: string = '';
</script>
<ListBox noMultiple>
  	{#each step1Options as option, i}
        <ListBoxItem bind:group={need} name="{option.value}" value="{option.value}"><svelte:fragment slot="lead"><img width="50px" alt="{option.text}" src="{option.icon}"/></svelte:fragment>{option.text}</ListBoxItem>
	{/each}
</ListBox>

<p>{need}</p>