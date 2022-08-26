import db from "../database.js"

export default
{
    messages: async (parent) =>
    {
        return await db.ticket.findUniqueOrThrow({where:{id:parent.id}}).messages()
    }
}