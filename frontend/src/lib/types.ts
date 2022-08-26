export type Ticket =
{
    id: Number,
    subject: String,
    severity: Severity,
    description: String,
    messages: Message[]
}

export enum Severity
{
    NOT_SEVERE="NOT_SEVERE",
    SEVERE="SEVERE",
    URGENT="URGENT"
}

export interface Message
{
    timeSent: Date
    content: String
    sender: User
}

export interface User
{
    email: String
    firstname: String
    lastname: String
}

export interface SelectableUser
{
    selected: boolean
    user: User
}