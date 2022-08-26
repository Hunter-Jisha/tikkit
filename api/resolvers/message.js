import db from "../database.js"

export default
{
    sender: async (parent) =>
    {
        return await db.message.findUniqueOrThrow({where:{id:parent.id}}).sender()
    }
}