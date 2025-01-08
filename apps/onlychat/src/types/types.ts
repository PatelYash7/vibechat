import { Prisma } from "@prisma/client";

export type UserType = Prisma.UserGetPayload<{}>

export interface Message {
    sender: string;
    content: string;
}

export interface RecentChat {
    user: UserType;
    lastMessage: string;
    timestamp: Date;
    unread: boolean;
}