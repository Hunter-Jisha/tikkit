<script lang="ts">
    import InitialsAvatar from "./InitialsAvatar.svelte";

    import type { Message } from "./types"

    export let id = 0
    export let subject

    export let lastMessage: Message
</script>

<button on:click={() => window.location.href = `/ticket/${id}`} class="row-span-1 col-span-1 bg-gray-900 rounded-2xl shadow-md flex flex-col p-4 gap-2 justify-between">
    <div class="flex w-full flex-row items-center gap-4 justify-between">
        <p class="text-gray-300 font-bold text-xl">{subject.substring(0, 32)}</p>
        
        <button on:click|stopPropagation={() => console.log("a")} class="w-10 h-10 rounded-full text-gray-400 hover:bg-gray-600 transition-all p-1">
            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6Z" fill="currentColor" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="currentColor" />
                <path d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18Z" fill="currentColor" />
            </svg>
        </button>
    </div>

    <div class="w-full h-16 bg-gray-800 rounded-xl shadow-inner flex flex-row p-2 gap-2">
        {#if lastMessage}
            <div class="h-full aspect-square rounded-full flex items-center justify-center bg-green-400 text-white font-bold">
                <InitialsAvatar name="{lastMessage.sender.firstname} {lastMessage.sender.lastname}"/>
            </div>

            <div class="flex flex-col w-full h-full items-start">
                <div class="w-full flex flex-row items-center gap-2">
                    <p class="text-gray-400">{lastMessage.sender.firstname} {lastMessage.sender.lastname}</p>
                    <p class="text-gray-500 text-sm">{`${new Date(lastMessage.timeSent).getHours()}:${new Date(lastMessage.timeSent).getMinutes()}`}</p>
                </div>
                <p class="text-gray-300">{lastMessage.content.substring(0, 32)}</p>
            </div>
        {/if}
    </div>
</button>