<script lang="ts">
    import { fly } from "svelte/transition"
    import type {Message} from "./types"
    import InitialsAvatar from "./InitialsAvatar.svelte"

    export let message: Message
    export let fromMe: Boolean
</script>

<div  transition:fly={{x: 50, duration: 200}} class="bg-gray-500 p-2 rounded-xl flex flex-row gap-2 items-center max-w-lg
{fromMe ? "bg-emerald-500 ml-auto" : "bg-gray-500 mr-auto"}">
    <div class="w-12 h-12">
        <InitialsAvatar name="{message.sender.firstname} {message.sender.lastname}"/>
    </div>
    
    <div class="flex flex-col gap-1">
        <div class="flex flex-row gap-2 items-center">
            <p class="whitespace-nowrap text-gray-700">{message.sender.firstname} {message.sender.lastname}</p>
            <p class="text-xs text-gray-600 whitespace-nowrap">{("0" + new Date(message.timeSent).getHours() % 12).slice(-2)}:{("0" + new Date(message.timeSent).getMinutes()).slice(-2)} {(new Date(message.timeSent).getHours()) >=12 ? "PM" : "AM"}</p>
        </div>
        <p class="text-gray-800">{message.content}</p>
    </div>
    
</div>