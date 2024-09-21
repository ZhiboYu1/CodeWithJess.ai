enum ChatItemRole {
    USER = 'user',
    JESS = 'jess'
}

interface DisplayChatItem {
    role: ChatItemRole;
    message: string;
}

export { ChatItemRole };
export type { DisplayChatItem };
