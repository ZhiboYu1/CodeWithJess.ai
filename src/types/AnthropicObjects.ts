import {ChatItemRole, DisplayChatItem} from "./DisplayChatItem";

interface AnthropicMessageObject {
    type: 'message';
    rawObject: any;
    shouldDisplay: boolean;
    role: 'user' | 'assistant';
    content: string;
}

function createAnthropicMessageObjectUser(content: string): AnthropicMessageObject {
    return {
        type: 'message',
        rawObject: null,
        shouldDisplay: true,
        role: 'user',
        content
    };
}

function createMockAnthropicMessageObjectAssistant(content: string): AnthropicMessageObject {
    return {
        type: 'message',
        rawObject: null,
        shouldDisplay: true,
        role: 'assistant',
        content
    };
}

interface AnthropicToolCallObject {
    type: 'toolCall';
    rawObject: any;
    shouldDisplay: false;
    input: any;
    name: string;
    id: string;
}

type AnthropicObject = AnthropicMessageObject | AnthropicToolCallObject;

function anthropicObjectToDisplayChatItem(anthropicObject: AnthropicObject): DisplayChatItem | null {
    if (anthropicObject.type === 'message') {
        if (!anthropicObject.shouldDisplay) {
            return null;
        }

        return {
            role: anthropicObject.role === 'user' ? ChatItemRole.USER : ChatItemRole.JESS,
            message: anthropicObject.content
        };
    } else if (anthropicObject.type === 'toolCall') {
        return null;
    }
    return null;
}

function sanitizeAnthropicObjectForTransfer(anthropicObject: AnthropicObject): any {
    if (anthropicObject.type === 'message') {
        return {
            role: anthropicObject.role,
            content: anthropicObject.content
        };
    } else if (anthropicObject.type === 'toolCall') {
        return {
            id: anthropicObject.id,
            input: anthropicObject.input,
            name: anthropicObject.name
        };
    }

    return null;
}

export type { AnthropicObject, AnthropicMessageObject, AnthropicToolCallObject };
export { anthropicObjectToDisplayChatItem, createAnthropicMessageObjectUser, createMockAnthropicMessageObjectAssistant, sanitizeAnthropicObjectForTransfer };
