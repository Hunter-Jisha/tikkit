import { gql } from "apollo-server"

export default gql`

    type Query {
      ping: String!
      ticket(sessionId: String!, id: Int!): Ticket!
      session(id: String!): Session!
      user(id: String): [User]
      getAllUsers: [User]!
    }

    type Mutation {
        register(firstname: String!, lastname: String!, email: String!, password: String!): Session!
        login(email: String!, password: String!): Session!
        createTicket(sessionId: String!, subject: String!, severity: Severity!, description: String!): Ticket!
        createMessage(sessionId: String!, ticketId: Int!, content: String!): Message!
        inviteUsersToTicket(sessionId: String!, ticketId: Int!, userIds: [String]!): [User]!
    }

    type Session {
        id: String!
        user: User!
    }

    enum Severity {
        NOT_SEVERE
        SEVERE
        URGENT
    }

    type Ticket {
        id: Int!
        subject: String!
        severity: Severity!
        description: String!
        accessToken: String!
        messages: [Message]!
    }

    type Message {
        sender: User!
        timeSent: Float!
        content: String!
    }

    type User {
        email: String!
        firstname: String!
        lastname: String!
        tickets: [Ticket]!
    }
`