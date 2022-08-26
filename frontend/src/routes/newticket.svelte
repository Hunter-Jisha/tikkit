<script lang="ts">
    import ErrorNotif from "$lib/ErrorNotif.svelte"
    import Form from "../lib/Form.svelte"
    import {ApolloClient, InMemoryCache, gql} from "@apollo/client/core"
    import {Severity, type Ticket} from "../lib/types"
    import { onMount } from "svelte";

    onMount(() =>
    {
        if(!window.localStorage.getItem("sessionId"))
        {
            //redirect to dashboard
            window.location.href = "/login";
        }
    })

    //initialize apollo client
    const apiClient = new ApolloClient(
        {
            //use backend url from .env file
            uri: import.meta.env.VITE_API_URL,
            cache: new InMemoryCache()
        }
    )

    enum Step
    {
        SUBJECT,
        SEVERITY,
        DESCRIPTION
    }

    var step: Step = Step.SUBJECT
    var ticket: Ticket = 
    {
        subject: "",
        severity: Severity.NOT_SEVERE,
        description: "",
    }

    async function submitTicket()
    {
        try
        {
            const response = await apiClient.mutate(
                {
                    //@ts-ignore
                    mutation: gql(`mutation{createTicket(sessionId: "${window.localStorage.getItem("sessionId")}", subject: "${ticket.subject}", severity: ${ticket.severity}, description: "${ticket.description}"){id}}`),
                }
            )

            //redirect to ticket
            window.location.href = `/ticket/${response.data.createTicket.id}`;
        }
        catch(e: any)
        {
            error = e.message
        }
    }

    var error: String
</script>

<div class="w-full h-full bg-gray-800 flex flex-col">
    <nav class="w-full h-12 flex flex-row bg-gray-900 items-center px-4 py-1 gap-4">
        <a href="/dashboard" class="text-emerald-400 font-bold text-2xl mr-auto">Tikkit</a>

        <a href="/dashboard" class="py-1 px-4 rounded-md bg-gray-500 text-white font-bold hover:bg-emerald-400 transition-all">Dashboard</a>

        <button class="h-full p-2 bg-gray-700 rounded-full ">
            <svg class="w-full h-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z" fill="currentColor" />
            </svg>
        </button>
    </nav>

    <div class="h-full w-full flex flex-col items-center pt-24 gap-8">
        {#if step === Step.SUBJECT}
            <div class="flex flex-col gap-2 items-center w-64 text-gray-500 text-center">
                <h1 class="text-gray-400 font-bold text-5xl whitespace-nowrap">New Ticket</h1>
                <p>Answer a few short questions and someone from the team will be able to start helping you</p>
            </div>

            <Form class="flex flex-col gap-4" handle={() => step = Step.SEVERITY}>
                <p class="text-gray-500 text-2xl font-bold ">Subject</p>
                <div class="flex flex-row gap-2 w-min h-12">
                    <input bind:value={ticket.subject} class="w-64 h-full rounded-md bg-gray-600 text-white px-4 focus:bg-gray-700" name="subject" type="text" placeholder="Subject">
                    <label class="h-full aspect-square rounded-lg bg-gray-600 p-2 text-white hover:bg-gray-700">
                        <input class="hidden" type="submit" value="">
                        <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z" fill="currentColor" />
                        </svg>
                    </label>
                </div>
            </Form>
        {:else if step === Step.SEVERITY}
            <div class="flex flex-col gap-4 items-center">
                <p class="text-gray-500 text-2xl font-bold ">How Severe is Your Issue?</p>
                <div class="flex flex-col w-64 gap-2">
                    <button on:click={() => ticket.severity = Severity.NOT_SEVERE} class="w-full h-12 bg-yellow-400 text-white font-bold rounded-lg hover:bg-yellow-500 transition-all {ticket.severity === Severity.NOT_SEVERE ? "bg-yellow-500 border-2 border-white" : ""}">{Severity.NOT_SEVERE}</button>
                    <button on:click={() => ticket.severity = Severity.SEVERE} class="w-full h-12 bg-orange-400 text-white font-bold rounded-lg hover:bg-orange-500 transition-all {ticket.severity === Severity.SEVERE ? "bg-orange-500 border-2 border-white" : ""}">{Severity.SEVERE}</button>
                    <button on:click={() => ticket.severity = Severity.URGENT} class="w-full h-12 bg-red-400 text-white font-bold rounded-lg hover:bg-red-500 transition-all {ticket.severity === Severity.URGENT ? "bg-red-500 border-2 border-white" : ""}">{Severity.URGENT}</button>
                    {#if ticket.severity}
                        <button on:click={() => step = Step.DESCRIPTION} class="py-2 hover:bg-gray-600 font-bold px-3 w-full items-center justify-between rounded-lg bg-gray-500 h-12 flex flex-row text-white">
                            <p>Next</p>
                            <svg class="h-full aspect-square" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z" fill="currentColor" />
                            </svg>
                        </button>
                    {/if}
                </div>
            </div>
        {:else if step === Step.DESCRIPTION}
            <div class="flex flex-col gap-4 items-center">
                <p class="text-gray-500 text-2xl font-bold ">Please provide a description of your issue</p>
                <p class="text-gray-400">A few important things to include:</p>
                <ul class="list-disc text-gray-500 text-sm">
                    <li>Exactly what the issue is</li>
                    <li>What you've tried</li>
                    <li>How long has the issue been occuring</li>
                </ul>
                <div class="flex flex-col w-96 gap-2">
                    <textarea bind:value={ticket.description} class="w-full h-48 rounded-xl bg-gray-700 p-4 text-white"></textarea>
                    {#if ticket.description.length >= 64}
                        <button on:click={submitTicket} class="py-2 hover:bg-gray-600 font-bold px-3 w-full items-center justify-between rounded-lg bg-gray-500 h-12 flex flex-row text-white">
                            <p>Next</p>
                            <svg class="h-full aspect-square" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z" fill="currentColor" />
                            </svg>
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<ErrorNotif bind:error={error}/>