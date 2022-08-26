import db from "../database.js"

export default
{
    user: async (parent) =>
    {
        return await db.session.findUniqueOrThrow({where:{id:parent.id}}).user()
    }
}