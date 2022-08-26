import db from "../database.js"

export default
{
    tickets: async (parent) =>
    {
        return (await db.user.findUniqueOrThrow({where:{email: parent.email}, include:{tickets:{include:{ticket:true}}}}))
        .tickets.map((ticketmemeber) => ticketmemeber.ticket)
    }
}