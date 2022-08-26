<script>
    import Form from "$lib/Form.svelte"
    import {onMount} from "svelte"
    import {ApolloClient, InMemoryCache, gql} from "@apollo/client/core"
    import ErrorNotif from "$lib/ErrorNotif.svelte"

    //initialize apollo client
    const apiClient = new ApolloClient(
        {
            //use backend url from .env file
            uri: import.meta.env.VITE_API_URL,
            cache: new InMemoryCache()
        }
    )

    //check for register mode on load
    onMount(() =>
    {
        if(window.location.hash === "#register")
        {
            registerMode = true
        }
    })

    async function register(inputs)
    {
        try
        {
            const response = await apiClient.mutate(
                {
                    //@ts-ignore
                    mutation: gql(`mutation{register(firstname: "${inputs.firstname}", lastname: "${inputs.lastname}", email: "${inputs.email}", password: "${inputs.password}"){ id }}`)
                }
            )

            //set sessionid
            window.localStorage.setItem("sessionId", response.data.createUser.id)

            //redirect to dashboard
            window.location.href = "/dashboard";
        }
        catch(e)
        {
            error = e.message
        }
    }

    async function login(inputs)
    {
        try
        {
            const response = await apiClient.mutate(
                {
                    //@ts-ignore
                    mutation: gql(`mutation{login(email: "${inputs.email}", password: "${inputs.password}"){ id }}`)
                }
            )

            //set sessionid
            window.localStorage.setItem("sessionId", response.data.login.id)

            //redirect to dashboard
            window.location.href = "/dashboard";
        }
        catch(e)
        {
            error = e.message
        }
    }

    var registerMode = false
    var error
</script>

<div class="w-full h-full bg-gray-800 flex items-center justify-center">
    <!--Background-->
    <div class="w-full h-full absolute top-0 left-0 bg-emerald-500" style="-webkit-mask-image: url(topography.svg); mask-image: url(topography.svg);"></div>

    <div class="z-10 backdrop-blur-lg bg-white bg-opacity-20 w-80 flex flex-col gap-4 p-8 border-white border-[1px] rounded-2xl">
        {#if registerMode}
            <h1 class="text-white font-bold text-2xl">Register</h1>

            <Form class="w-full flex flex-col gap-2" handle={//@ts-ignore
            (inputs) => register(inputs)}>
                <div class="w-full flex flex-row h-12 gap-2">
                    <input class="w-full h-full rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" type="text" name="firstname" placeholder="Firstname">
                    <input class="w-full h-full rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" type="text" name="lastname" placeholder="Lastname">
                </div>
                <input class="w-full h-12 rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" name="email" type="email" placeholder="Email"/>
                <input class="w-full h-12 rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" name="password" type="password" placeholder="Password"/>
                <input class="h-12 bg-emerald-400 text-white font-bold text-md rounded-lg cursor-pointer hover:bg-emerald-500" type="submit" value="Register"/>
            </Form>

            <a on:click={() => registerMode = false} href=" " class="self-center text-emerald-400 font-bold">Login</a>
        {:else}
            <h1 class="text-white font-bold text-2xl">Login</h1>
            <Form class="w-full flex flex-col gap-4" handle={login}>
                <input class="w-full h-12 rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" name="email" type="email" placeholder="Email"/>
                <input class="w-full h-12 rounded-lg px-4 bg-opacity-10 bg-white backdrop-blur-md text-white" name="password" type="password" placeholder="Password"/>
                <input class="h-12 bg-emerald-400 text-white font-bold text-md rounded-lg cursor-pointer hover:bg-emerald-500" type="submit" value="Login"/>
            </Form>

            <a on:click={() => registerMode = true} href="#register" class="self-center text-emerald-400 font-bold">Register</a>
        {/if}
        
    </div>
</div>

<ErrorNotif bind:error={error}/>