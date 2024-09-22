import "./AssistantChat.css"
import React, {useCallback, useState, useEffect} from 'react';
import Anthropic from '@anthropic-ai/sdk';
import {ChatMessageList, ChatMessageListSizeParams} from './ChatMessageList';
import {DisplayChatItem, ChatItemRole} from "../../types/DisplayChatItem";
import {ChatMessageItemResources, ChatMessageItemSizeParams} from './ChatMessageItem';
import { ChatMessageInputBox, ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams } from './ChatMessageInputBox';
import { ANTHROPIC_API_KEY } from "../../secrets";
import TextBlock = Anthropic.TextBlock;
import {
    AnthropicMessageObject,
    AnthropicObject, anthropicObjectToDisplayChatItem,
    createAnthropicMessageObjectUser,
    createMockAnthropicMessageObjectAssistant,
    sanitizeAnthropicObjectForTransfer
} from "../../types/AnthropicObjects";

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true
});

interface AssistantChatProps {
    transformPrompt: (chatHistory: AnthropicObject[]) => AnthropicObject[];
    systemPrompt: string | null,
    assistantTools: Anthropic.Messages.Tool[];
    handleToolUse: (tool_name: string, tool_input: any) => string | null;
    chatMessageItemResources: ChatMessageItemResources;
    chatMessageItemSizeParams: ChatMessageItemSizeParams;
    chatMessageListSizeParams: ChatMessageListSizeParams;
    chatMessageInputBoxResources: ChatMessageInputBoxResources;
    chatMessageInputBoxSizeParams: ChatMessageInputBoxSizeParams;
    defaultChatHistory?: AnthropicObject[];
    onNewMessage?: (messages: AnthropicObject[]) => void;
}

const AssistantChat: React.FC<AssistantChatProps> = ({
    transformPrompt,
    systemPrompt,
    assistantTools,
    handleToolUse,
    chatMessageItemResources,
    chatMessageItemSizeParams,
    chatMessageListSizeParams,
    chatMessageInputBoxResources,
    chatMessageInputBoxSizeParams,
    defaultChatHistory = [], // Default value is an empty array
    onNewMessage
}) => {
    const [chatHistory, setChatHistory] = useState<AnthropicObject[]>(defaultChatHistory);
    const [ongoingAssistantResponse, setOngoingAssistantResponse] = useState<string | null>(null);

    const handleSubmit = useCallback(async (userInput: string) => {
        const userMessage: AnthropicObject = createAnthropicMessageObjectUser(userInput);
        const newChatHistory = [...chatHistory, userMessage];
        setChatHistory(newChatHistory);
        onNewMessage?.([userMessage]);

        const processedPrompt = transformPrompt(newChatHistory);
        const sanitizedPrompt = processedPrompt.map(sanitizeAnthropicObjectForTransfer);

        setOngoingAssistantResponse('');

        let finalMessage = await anthropic.messages.stream({
            messages: sanitizedPrompt as any,
            model: 'claude-3-5-sonnet-20240620',
            tools: assistantTools,
            system: (systemPrompt === null ? undefined : systemPrompt),
            temperature: 0,
            max_tokens: 4096,
        }).on('text', (text) => {
            setOngoingAssistantResponse(prev => (prev ?? '') + text);
        }).finalMessage();

        setOngoingAssistantResponse(null);

        for (const contentBlock of finalMessage.content) {
            if (contentBlock.type === 'text') {
                const assistantMessage: AnthropicMessageObject = {
                    type: 'message',
                    rawObject: contentBlock,
                    shouldDisplay: true,
                    role: 'assistant',
                    content: (finalMessage.content[0] as TextBlock).text
                };
                setChatHistory(prev => [...prev, assistantMessage]);
                onNewMessage?.([assistantMessage]);
            } else if (contentBlock.type === 'tool_use') {
                const toolUse = contentBlock as Anthropic.ToolUseBlock;
                console.log(toolUse);
                let result = handleToolUse(toolUse.name, toolUse.input);
                if (result !== null) {
                    // TODO: Handle tool results
                }
            }
        }
    }, [chatHistory, onNewMessage, transformPrompt, assistantTools, systemPrompt, handleToolUse]);

    let objectsToDisplay = ongoingAssistantResponse ? [...chatHistory, createMockAnthropicMessageObjectAssistant(ongoingAssistantResponse)] : chatHistory;
    let displayChatItems: DisplayChatItem[] = objectsToDisplay.map(anthropicObjectToDisplayChatItem).filter((item): item is DisplayChatItem => item !== null);

    return (
        <div
            className="assistant-chat"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}
        >
            <div
                style={{
                    overflowY: 'scroll',
                    height: '100%',
                    flexGrow: 1,
                }}
                className={'invisible-scrollbar'}
            >
                <ChatMessageList
                    chatItems={displayChatItems}
                    chatMessageItemResources={chatMessageItemResources}
                    chatMessageItemSizeParams={chatMessageItemSizeParams}
                    chatMessageListSizeParams={chatMessageListSizeParams}
                />
            </div>
            <ChatMessageInputBox
                resources={chatMessageInputBoxResources}
                sizeParams={chatMessageInputBoxSizeParams}
                onSend={handleSubmit}
            />
        </div>
    );
};

export default AssistantChat;