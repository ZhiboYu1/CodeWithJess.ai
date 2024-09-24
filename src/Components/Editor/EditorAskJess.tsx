import React, {useEffect, useRef, useState} from 'react';
import './EditorAskJess.css';
import { AnthropicObject } from "../../types/AnthropicObjects";
import {
    getGradingAssistantTools,
    EDITOR_INITIAL_MESSAGES,
    EDITOR_SYSTEM_PROMPT, transformPromptForJess
} from "./EditorAssistantPrompts";
import AssistantChat from "../Chat/AssistantChat";
import { ChatMessageItemResources, ChatMessageItemSizeParams } from "../Chat/ChatMessageItem";
import { ChatMessageListSizeParams } from "../Chat/ChatMessageList";
import { ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams } from "../Chat/ChatMessageInputBox";
import EditorJessState from "./EditorJessState";

interface ChatProps {
    show: boolean;
    chatHeight: string;
    getJessState: () => EditorJessState;
    location: number;
    toNextExercise: () => void;
}

const EditorAskJess: React.FC<ChatProps> = ({ show, chatHeight, getJessState, location, toNextExercise }) => {
    const mainRef = useRef<HTMLDivElement>(null);

    const chatMessageItemResources: ChatMessageItemResources = {
        userIcon: "/ask_jess/human_icon.png",
        jessIcon: "/ask_jess/jess_icon.png",
        avatarIconSize: 29,
        userTextImage: "/ask_jess/you_text.png",
        userTextImageHeight: 14,
        userTextImageWidth: 35,
        jessTextImage: "/ask_jess/jess_text.png",
        jessTextImageHeight: 14,
        jessTextImageWidth: 42,
    };

    const chatMessageListSizeParams: ChatMessageListSizeParams = {
        topPadding: 15,  // huh? the following too.
        bottomPadding: 15,
        elementSpacing: 30,
    };

    const chatMessageInputBoxResources: ChatMessageInputBoxResources = {
        sendButtonImage: "/ask_jess/send_button.png",
        sendButtonImageSize: 40,
    };

    const chatMessageInputBoxSizeParams: ChatMessageInputBoxSizeParams = {
        inputBoxFontSize: 15,
        inputBoxFontWeight: 600,
        inputBoxLineHeight: 20,
        inputBoxBackgroundColor: "#393939",
        inputBoxPlaceholderColor: "#949495",
        inputBoxBorderRadius: 20,
        inputFieldWidth: 295,
        inputFieldLeftPadding: 17,
        inputFieldRightPadding: 20,
        inputFieldVerticalPadding: 10,
        sendButtonBottomAndRightPadding: 0,
    };

    const chatMessageItemSizeParams: ChatMessageItemSizeParams = {
        fullMessageItemWidth: 371,
        avatarToTextSpacing: 10,
        senderTextToContentSpacing: 5,
        messageTextFontSize: 15,
        messageTextWidth: 271,
        messageTextColor: "#FFFFFF",
        messageTextFontWeight: 600,
        messageTextLineHeight: 1.33,
        messageTextParagraphSpacing: 10,
    };

    const boundingBox = mainRef.current?.getBoundingClientRect();
    const width = boundingBox?.width;
    const offsetPixels = width || 0;

    return (
        <div className={`chat-container ${show ? 'visible' : 'hidden'}`} style={{
            height: chatHeight,
            left: location - (offsetPixels || 0),
            backgroundImage: `url(${process.env.PUBLIC_URL}/ask_jess/background.png)`
        }} ref={mainRef}>
            <AssistantChat
                transformPrompt={(chatHistory: AnthropicObject[]) => {
                    const newPrompt = transformPromptForJess(chatHistory, getJessState());
                    console.log(newPrompt);
                    return newPrompt;
                }}
                systemPrompt={EDITOR_SYSTEM_PROMPT}
                assistantTools={getGradingAssistantTools()}
                chatMessageItemResources={chatMessageItemResources}
                chatMessageItemSizeParams={chatMessageItemSizeParams}
                chatMessageListSizeParams={chatMessageListSizeParams}
                chatMessageInputBoxResources={chatMessageInputBoxResources}
                chatMessageInputBoxSizeParams={chatMessageInputBoxSizeParams}
                defaultChatHistory={EDITOR_INITIAL_MESSAGES}
                handleToolUse={(tool_name, tool_input) => {
                    if (tool_name !== "grade_user") {
                        // error
                        return null;
                    }
                    console.log("Tool evaluated, grade given", tool_input);
                    const grade: string = tool_input.grade;
                    console.log("Grade given, ", grade)
                    if (grade==="Pass" || grade==="pass") {
                        toNextExercise();
                    }
                    return null;
                }}
            />
        </div>
    );
};

export default EditorAskJess;
