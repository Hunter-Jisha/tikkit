import {ApolloClient, InMemoryCache} from "@apollo/client/core"

export default function(backendUrl)
{
    //initialize apollo client
    return new ApolloClient(
        {
            uri: backendUrl,
            cache: new InMemoryCache({
                freezeResults: false,
              })
        }
    )
}