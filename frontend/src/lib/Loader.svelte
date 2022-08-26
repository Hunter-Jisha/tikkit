<script>
    export let loaded = false

    const bars = 10
    const delay = 50

    var showBars = new Array(10).fill(false)

    $: {
        if(loaded)
        {
            show(0)
        }
    }

    function show(pos)
    {
        if(pos < showBars.length)
        {
            showBars[pos] = true
            setTimeout(() => show(pos + 1), delay)
        }
    }
</script>

{#if loaded}
    <slot/>
{/if}
