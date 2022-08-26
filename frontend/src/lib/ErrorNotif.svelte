<script>
    import { fly } from "svelte/transition"
    export let error
    var show = false

    $: trigger(error)

    function trigger(e)
    {
        if(e)
        {   
            show = true
            setTimeout(() => {show = false; error = null}, 3000)
        }
    }
</script>

{#if show}
    <div transition:fly={{y:-50}} class="z-20 flex flex-row p-4 gap-2 w-64 fixed top-6 left-1/2 -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-md border-white border-2 rounded-lg items-center">
        <p class="text-white">{error}</p>
        <button on:click={() => show = false} class="flex-shrink-0 w-10 h-10 p-1 rounded-full bg-white bg-opacity-0 hover:bg-opacity-20 transition-all text-white ml-auto">
            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
            </svg>
        </button>
    </div>
{/if}