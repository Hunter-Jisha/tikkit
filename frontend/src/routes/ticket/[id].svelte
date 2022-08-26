<script lang="ts">
    import Form from "$lib/Form.svelte"
    import { onMount } from "svelte"
    import {Severity, type Ticket, type Message, type User, type SelectableUser} from "../../lib/types"
    import { page } from '$app/stores'
    import Loader from "$lib/Loader.svelte"
    import GQLClientGenerator from "../../lib/GQLClientGenerator"
    import { gql } from "@apollo/client/core"
    import MessageBubble from "$lib/MessageBubble.svelte"
    import SelectUsersModal from "$lib/SelectUsersModal.svelte"

    onMount(async () =>
    {
        apiClient = GQLClientGenerator(import.meta.env.VITE_API_URL)

        var response = await apiClient.query(
            {
                query: gql(`{session(id: "${window.localStorage.getItem("sessionId")}"){ user{email} }}`)
            }
        )

        myEmail = response.data.session.user.email

        response = await apiClient.query(
            {
                //@ts-ignore
                query: gql(`{ticket(sessionId: "${window.localStorage.getItem("sessionId")}", id: ${$page.params.id}){ id subject severity description accessToken messages{ sender{firstname lastname email} timeSent content}}}`),
            }
        )

        ticket = JSON.parse(JSON.stringify(response.data.ticket))
        accessToken = response.data.ticket.accessToken

        const webSocket = new WebSocket(`${import.meta.env.VITE_WS_URL}?accessToken=${accessToken}`)
        webSocket.onopen = () => {
            console.log("opened")
        }
        webSocket.onmessage = (data) =>
        {
            //@ts-ignore
            const message = JSON.parse(data.data)
            ticket.messages = [...ticket.messages, message]
        }

        loaded = true
    })

    //@ts-ignore
    async function sendMessage(input)
    {
        //@ts-ignore
        const response = await apiClient.mutate(
            {
                //@ts-ignore
                mutation: gql(`mutation{createMessage(sessionId: "${window.localStorage.getItem("sessionId")}", ticketId: ${ticket.id}, content: "${input.content}"){content}}`)
            }
        )

        //@ts-ignore
        document.getElementById("content-input").value = ""
    }

    async function openInvite()
    {
        //@ts-ignore
        const response = await apiClient.query(
            {
                //@ts-ignore
                query: gql(`{user{firstname lastname email}}`),
            }
        )

        availableUsers = response.data.user.map((user) => {return {user: user, selected: false}})
        console.log(availableUsers)

        inviteOthersOpen = true
    }

    async function inviteUsers(users)
    {
        console.log(users)
    }

    var loaded = false
    var ticket: Ticket =
    {
        id: 0,
        subject: "",
        severity: Severity.NOT_SEVERE,
        description: "",
        messages: []
    }
    var accessToken
    //@ts-ignore
    var apiClient
    var myEmail: String
    var inviteOthersOpen = false

    var availableUsers: SelectableUser[] = []
</script>

<Loader bind:loaded={loaded}>
    <div class="w-full h-full bg-gray-800 flex flex-col pt-12">
        <nav class="fixed top-0 left-0 w-full h-12 flex flex-row bg-gray-900 items-center px-4 py-1 gap-4">
            <a href="/dashboard" class="text-emerald-400 font-bold text-2xl mr-auto">Tikkit</a>
    
            <a href="/dashboard" class="py-1 px-4 rounded-md bg-gray-500 text-white font-bold hover:bg-emerald-400 transition-all">Dashboard</a>
    
            <button class="h-full p-2 bg-gray-700 rounded-full ">
                <svg class="w-full h-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" fill="currentColor" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z" fill="currentColor" />
                </svg>
            </button>
        </nav>
    
        <div class="w-full h-full flex-grow-0 flex flex-row">
            <div class="h-full w-96 bg-gray-700 flex-shrink-0">
                <div class="flex flex-col w-full h-full p-4 gap-8">
                    <div class="flex flex-col w-full gap-2">
                        <p class="text-md text-gray-900">Subject</p>
                        <p class="text-xl font-bold text-gray-500">{ticket.subject}</p>
                    </div>
    
                    <div class="flex flex-col w-full gap-2">
                        <p class="text-md text-gray-900">Severity</p>
                        <p class="w-min whitespace-nowrap text-md font-bold text-white px-4 py-2 rounded-md {ticket.severity === Severity.NOT_SEVERE ? "bg-yellow-300" : ticket.severity === Severity.SEVERE ? "bg-orange-400" : ticket.severity === Severity.URGENT ? "bg-red-400" : ""}">{ticket.severity}</p>
                    </div>
    
                    <div class="flex flex-col w-full gap-2">
                        <p class="text-md text-gray-900">Description</p>
                        <p class="text-lg max-h-48 overflow-y-scroll text-gray-400 break-all">{ticket.description}</p>
                    </div>

                    <div class="mt-auto flex flex-row gap-4 w-full h-12 flex-shrink-0">
                        <button on:click={openInvite} class="w-full h-full text-white font-bold bg-gray-800 rounded-xl hover:bg-gray-900 transition-all">
                            Invite Others
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col w-full h-full">
                <div class="flex w-full h-full p-4 gap-4 overflow-y-scroll flex-col-reverse">
                    {#each ticket.messages.slice().reverse() as message}
                        <MessageBubble fromMe={message.sender.email === myEmail} message={message}/>
                    {/each}
                </div>
    
                <div class="flex flex-row flex-shrink-0 w-full h-16 bg-gray-900 p-2">
                    <Form class="w-full h-full flex flex-row gap-2" handle={sendMessage}>
                        <input id="content-input" class="w-full h-full bg-gray-800 rounded-xl px-4 text-white" name="content" type="text" placeholder="Message">
                        <input class="h-full px-8 rounded-xl bg-emerald-500 font-bold text-white hover:bg-emerald-600 cursor-pointer" type="submit" value="Send">
                    </Form>
                </div>
            </div>
        </div>
    </div>

    <SelectUsersModal handle={inviteUsers} bind:open={inviteOthersOpen} bind:users={availableUsers}/>
</Loader>