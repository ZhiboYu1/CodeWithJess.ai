enum ChatUser {
    USER = 'user',
    JESS = 'jess'
}

interface ChatDisplayItem {
    sender: ChatUser;
    message: string;
}

export {ChatUser};
export type { ChatDisplayItem };
