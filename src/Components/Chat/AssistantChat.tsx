import "./AssistantChat.css"
import React, {useCallback, useState, useEffect} from 'react';
import Anthropic from '@anthropic-ai/sdk';
import {ChatMessageList, ChatMessageListSizeParams} from './ChatMessageList';
import {ChatItem, ChatUser} from "../../types/ChatItem";
import {ChatMessageItemResources, ChatMessageItemSizeParams} from './ChatMessageItem';
import { ChatMessageInputBox, ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams } from './ChatMessageInputBox';
import { ANTHROPIC_API_KEY } from "../../secrets";
import TextBlock = Anthropic.TextBlock;
import {AnthropicMessageParam} from "../../types/AnthropicMessageParam";

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true
});

interface AssistantChatProps {
    transformPrompt: (chatHistory: ChatItem[]) => [AnthropicMessageParam[], string | null];
    assistantTools: Anthropic.Messages.Tool[];
    handleToolUse: (tool_name: string, tool_input: any) => string | null;
    chatMessageItemResources: ChatMessageItemResources;
    chatMessageItemSizeParams: ChatMessageItemSizeParams;
    chatMessageListSizeParams: ChatMessageListSizeParams;
    chatMessageInputBoxResources: ChatMessageInputBoxResources;
    chatMessageInputBoxSizeParams: ChatMessageInputBoxSizeParams;
    defaultChatHistory?: ChatItem[]; // New prop for default chat history
    onNewMessage?: (message: ChatItem) => void; // New callback prop
}

const AssistantChat: React.FC<AssistantChatProps> = ({
    transformPrompt,
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
    const [chatHistory, setChatHistory] = useState<ChatItem[]>(defaultChatHistory);
    const [ongoingAssistantResponse, setOngoingAssistantResponse] = useState<string | null>(null);

    useEffect(() => {
        // Call onNewMessage for each message in the default chat history
        defaultChatHistory.forEach(message => {
            onNewMessage?.(message);
        });
    }, [defaultChatHistory, onNewMessage]); // Empty dependency array ensures this runs only once on mount

    const handleSubmit = useCallback(async (userInput: string) => {
        const userMessage: ChatItem = { sender: ChatUser.USER, message: userInput };
        const newChatHistory = [...chatHistory, userMessage];
        setChatHistory(newChatHistory);
        onNewMessage?.(userMessage);

        const [processedPrompt, systemPrompt] = transformPrompt(newChatHistory);

        setOngoingAssistantResponse('');

        let finalMessage = await anthropic.messages.stream({
            messages: processedPrompt,
            model: 'claude-3-5-sonnet-20240620',
            tools: assistantTools,
            system: (systemPrompt === null ? undefined : systemPrompt),
            max_tokens: 4096,
        }).on('text', (text) => {
            setOngoingAssistantResponse(prev => (prev ?? '') + text);
        }).finalMessage();

        setOngoingAssistantResponse(null);

        for (const contentBlock of finalMessage.content) {
            if (contentBlock.type === 'text') {
                const assistantMessage: ChatItem = { sender: ChatUser.JESS, message: (finalMessage.content[0] as TextBlock).text };
                setChatHistory(prev => [...prev, assistantMessage]);
                onNewMessage?.(assistantMessage);
            } else if (contentBlock.type === 'tool_use') {
                const toolUse = contentBlock as Anthropic.ToolUseBlock;
                let result = handleToolUse(toolUse.name, toolUse.input);
                if (result !== null) {
                    // TODO: Handle tool results
                }
            }
        }
    }, [chatHistory, onNewMessage, transformPrompt, assistantTools]);

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
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflowY: 'scroll',
                }}
                className={'invisible-scrollbar'}
            >
                <ChatMessageList
                    chatItems={ongoingAssistantResponse !== null ? [...chatHistory, { sender: ChatUser.JESS, message: ongoingAssistantResponse }] : chatHistory}
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