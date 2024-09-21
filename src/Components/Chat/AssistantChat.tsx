// AssistantChat:
/*
a mega-component that combines together the ChatMessageList and the input box and also further maintains state:
we do need a way to customize the prompt of individual objects, so the AssistantChat component will need to accept a prop that allows the user to pass in a custom
function that takes a string and returns a string (the prompt).
the component will maintain a state of the chat history, and the user's input, and the assistant's response.
it should also stream the assistant's response, and update the chat history as it does so.
*/

import React, {useCallback, useState} from 'react';
import Anthropic from '@anthropic-ai/sdk';
import {ChatMessageList, ChatMessageListSizeParams} from './ChatMessageList';
import {ChatDisplayItem, ChatUser} from "../../types/ChatDisplayItem";
import {ChatMessageItemResources, ChatMessageItemSizeParams} from './ChatMessageItem';
import { ChatMessageInputBox, ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams } from './ChatMessageInputBox';
import { ANTHROPIC_API_KEY} from "../../secrets";
import TextBlock = Anthropic.TextBlock;

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true 
});

interface AssistantChatProps {
    getCustomPrompt: (input: string) => string;
    chatMessageItemResources: ChatMessageItemResources;
    chatMessageItemSizeParams: ChatMessageItemSizeParams;
    chatMessageListSizeParams: ChatMessageListSizeParams;
    chatMessageInputBoxResources: ChatMessageInputBoxResources;
    chatMessageInputBoxSizeParams: ChatMessageInputBoxSizeParams;
}

const AssistantChat: React.FC<AssistantChatProps> = ({ getCustomPrompt, chatMessageItemResources, chatMessageItemSizeParams, chatMessageListSizeParams, chatMessageInputBoxResources, chatMessageInputBoxSizeParams }) => {
    const [chatHistory, setChatHistory] = useState<ChatDisplayItem[]>([]);
    const [ongoingAssistantResponse, setOngoingAssistantResponse] = useState<string | null>(null);
    
    const handleSubmit = useCallback(async (userInput: string) => {
        // Add user message to chat history
        setChatHistory(prev => [...prev, { sender: ChatUser.USER, message: userInput }]);
        
        // Process input with custom prompt
        const processedInput = getCustomPrompt(userInput);
        
        setOngoingAssistantResponse('');

        let finalMessage = await anthropic.messages.stream({
            messages: [{role: 'user', content: processedInput}],
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1024,
        }).on('text', (text) => {
            setOngoingAssistantResponse(prev => (prev ?? '') + text);
        }).finalMessage();

        // Add assistant's response to chat history
        setChatHistory(prev => [...prev, { sender: ChatUser.JESS, message: (finalMessage.content[0] as TextBlock).text }]);

        setOngoingAssistantResponse(null);
    }, [getCustomPrompt, ongoingAssistantResponse]);
    
    return (
        <div className="assistant-chat">
            <ChatMessageList
                chatItems={ongoingAssistantResponse !== null ? [...chatHistory, { sender: ChatUser.JESS, message: ongoingAssistantResponse }] : chatHistory}
                chatMessageItemResources={chatMessageItemResources}
                chatMessageItemSizeParams={chatMessageItemSizeParams}
                chatMessageListSizeParams={chatMessageListSizeParams}
            />
            <ChatMessageInputBox
                resources={chatMessageInputBoxResources}
                sizeParams={chatMessageInputBoxSizeParams}
                onSend={handleSubmit}
            />
        </div>
    );
};

export default AssistantChat;