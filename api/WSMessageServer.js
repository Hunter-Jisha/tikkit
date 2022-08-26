const conversationMap = new Map()

export default 
{
    joinConversation: (ws, accessToken) =>
    {
        if(!conversationMap.get(accessToken))
        {
            conversationMap.set(accessToken, [])
        }
        
        conversationMap.get(accessToken).push(ws)
    },
    sendMessage: (accessToken, sender, timeSent, content) =>
    {
        conversationMap.get(accessToken).forEach(ws => 
        {
            ws.send(JSON.stringify(
                {
                    sender:
                    {
                        email: sender.email,
                        firstname: sender.firstname,
                        lastname: sender.lastname
                    },
                    timeSent,
                    content
                }
            ))
        })
    }
}