<script lang="ts">
    import {fade} from "svelte/transition"
    import type { SelectableUser, User } from "./types"
    import InitialsAvatar from "./InitialsAvatar.svelte"
    export let open = false

    export let users: SelectableUser[] = []

    export let handle

    //@ts-ignore
    $:showSelect(users)

    function showSelect()
    {
        var show = false
        users.forEach((user) => user.selected ? show = true : {})
        showSelectButton = show
    }

    function select()
    {
        var selectedUsers: User[] = []
        users.forEach((user) => user.selected ? selectedUsers.push(user.user) : {})
        handle(selectedUsers)
    }

    var showSelectButton = false
</script>

{#if open}
    <div transition:fade={{duration: 100}} on:click|self={() => open = false} class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div class="w-96 p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border-white border-4 flex flex-col gap-2">
            <div class="flex flex-row items-center justify-between">
                <p class="text-white font-bold text-2xl">Invite Others</p>
                <button on:click={() => open = false} class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-50 transition-all text-white rounded-md p-2">
                    <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
            
            {#each users as user}
                <button class="w-full h-14 rounded-xl flex flex-row p-1 backdrop-blur-sm gap-2 border-2 border-opacity-0 border-emerald-400
                {user.selected ? "bg-emerald-400 bg-opacity-40 border-opacity-100" : "bg-white bg-opacity-20"}"
                on:click={() => user.selected = !user.selected}>
                    <div class="h-full aspect-square p-1">
                        <InitialsAvatar name="{user.user.firstname} {user.user.lastname}"/>
                    </div>

                    <div class="flex flex-col items-start">
                        <p class="text-white font-bold text-lg">{user.user.firstname} {user.user.lastname}</p>
                        <p class="text-gray-300 font-thin text-sm">{user.user.email}</p>
                    </div>
                </button>
            {/each}

            {#if showSelectButton}
                <button on:click={select} class="w-full h-12 bg-emerald-400 rounded-lg text-white font-bold text-lg">Invite</button>
            {/if}
        </div>
    </div>
{/if}