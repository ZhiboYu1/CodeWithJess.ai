import {AnthropicMessageParam} from "./AnthropicMessageParam";

enum ChatUser {
    USER = 'user',
    JESS = 'jess'
}

interface ChatItem {
    sender: ChatUser;
    message: string;
}

function chatItemToAnthropicMessage(chatItem: ChatItem): AnthropicMessageParam {
    return { 'role': chatItem.sender === ChatUser.USER ? 'user' : 'assistant', 'content': chatItem.message };
}

export { ChatUser, chatItemToAnthropicMessage };
export type { ChatItem };
