import { ApolloServer } from 'apollo-server-express'
import typedefs from "./typedefs.js"
import resolvers from "./resolvers/index.js"
import expressWs from "express-ws"
import express from 'express'
import wsServer from './WSMessageServer.js'
import "dotenv/config"

const server = express()

const api = new ApolloServer(
    {
        typeDefs: typedefs,
        resolvers: resolvers
    }
)

await api.start()

api.applyMiddleware({app: server, path: "/api"})

expressWs(server)

server.ws('/ws', (ws, req) => 
{
    wsServer.joinConversation(ws, req.query.accessToken)
})
  

server.listen(process.env.PORT || 8000, () =>
{
    console.log("Running...")
})