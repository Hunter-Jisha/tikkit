import validate from "../validation.js"
import bcrypt from "bcrypt"
import db from "../database.js"
import randomstring from "randomstring"
import WSMessageServer from "../WSMessageServer.js"

export default
{
    register: async (parent, args) =>
    {
        //validate user input
        validate.user.validate(args)

        //hash password
        args.password = bcrypt.hashSync(args.password, 10)

        //insert into database and return user
        return await db.user.create(
            {
                data: args
            }
        )
    },
    login: async (parent, args) =>
    {
        //find user from database
        const user = await db.user.findUniqueOrThrow(
            {
                where:
                {
                    email: args.email
                }
            }
        )

        //verify password
        if(!bcrypt.compareSync(args.password, user.password))
        {
            throw Error("Incorrect username or password")
        }

        //create session and return
        return await db.session.create(
            {
                data:
                {
                    user:
                    {
                        connect:
                        {
                            email: user.email
                        }
                    }
                }
            }
        )
    },
    createTicket: async (parent, args) =>
    {
        //find user from session
        const user = await db.session.findUniqueOrThrow({where: {id: args.sessionId}}).user()

        return await db.ticket.create(
            {
                data:
                {
                    subject: args.subject,
                    severity: args.severity,
                    description: args.description,
                    accessToken: randomstring.generate(8),
                    creator:
                    {
                        connect:
                        {
                            email: user.email
                        }
                    },
                    members:
                    {
                        create:
                        {
                            member:
                            {
                                connect:
                                {
                                    email: user.email
                                }
                            }
                        }
                    }
                }
            }
        )
    },
    createMessage: async (parent, args) =>
    {
        const user = await db.session.findUniqueOrThrow({where: {id: args.sessionId}}).user()
        const ticket = await db.ticket.findUniqueOrThrow({where: {id: args.ticketId}})

        const message = await db.message.create(
            {
                data:
                {
                    sender:
                    {
                        connect:
                        {
                            email: user.email
                        }
                    },
                    content: args.content,
                    ticket:
                    {
                        connect:
                        {
                            id: ticket.id
                        }
                    }
                }
            }
        )

        WSMessageServer.sendMessage(ticket.accessToken, user, message.timeSent, message.content)

        return message
    },
    inviteUsersToTicket: async (parent, args) =>
    {
        return await db.ticket.update(
            {
                where: 
                {
                    id: args.ticketId
                },
                data:
                {
                    members:
                    {
                        connect:
                        {
                            id: args.userIds
                        }
                    }
                }
            }
        )
    }
}