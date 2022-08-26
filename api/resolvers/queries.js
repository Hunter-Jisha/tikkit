import db from "../database.js"

export default
{
    ping: () => "Pong!",
    session: async (parent, args) =>
    {
        return await db.session.findUniqueOrThrow({where:{id: args.id}})
    },
    ticket: async (parent, args) =>
    {
        return await db.ticket.findUniqueOrThrow({where: {id: args.id}})
    },
    user: async (parent, args) =>
    {
        return await args.email ? db.user.findUniqueOrThrow({where: {email: args.email}}) : db.user.findMany({})
    }
}