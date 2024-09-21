import React from 'react';
import './Onboarding.css';
import {ChatMessageListSizeParams} from "../../Components/Chat/ChatMessageList";
import {ChatMessageItemResources, ChatMessageItemSizeParams} from '../../Components/Chat/ChatMessageItem';
import {ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams} from '../../Components/Chat/ChatMessageInputBox';
import AssistantChat from '../../Components/Chat/AssistantChat';
import {
    getOnboardingAssistantTools,
    ONBOARDING_INITIAL_MESSAGES, ONBOARDING_SYSTEM_PROMPT,
} from "./OnboardingAssistantPrompts";
import {ChatItemRole} from "../../types/DisplayChatItem";
import {AnthropicObject} from "../../types/AnthropicObjects";

const OnboardingPage = () => {
    const chatMessageItemResources: ChatMessageItemResources = {
        userIcon: "/onboarding/human_icon.png",
        jessIcon: "/onboarding/jess_icon.png",
        avatarIconSize: 65,
        userTextImage: "/onboarding/you_text.png",
        userTextImageHeight: 30,
        userTextImageWidth: 68,
        jessTextImage: "/onboarding/jess_text.png",
        jessTextImageHeight: 30,
        jessTextImageWidth: 82,
    };

    const chatMessageItemSizeParams: ChatMessageItemSizeParams = {
        fullMessageItemWidth: 1154,
        avatarToTextSpacing: 25,
        senderTextToContentSpacing: 10,
        messageTextFontSize: 22,
        messageTextWidth: 888,
        messageTextColor: "#FFFFFF",
        messageTextFontWeight: 600,
        messageTextLineHeight: 1.5,
        messageTextParagraphSpacing: 0,
    };

    const chatMessageListSizeParams: ChatMessageListSizeParams = {
        topPadding: 30,
        bottomPadding: 30,
        elementSpacing: 20,
    };

    const chatMessageInputBoxResources: ChatMessageInputBoxResources = {
        sendButtonImage: "/onboarding/send_button.png",
        sendButtonImageSize: 44,
    };

    const chatMessageInputBoxSizeParams: ChatMessageInputBoxSizeParams = {
        inputBoxFontSize: 22,
        inputBoxFontWeight: 600,
        inputBoxLineHeight: 33,
        inputBoxBackgroundColor: "#2C2C2D",
        inputBoxPlaceholderColor: "#949495",
        inputBoxBorderRadius: 30,
        inputFieldWidth: 872,
        inputFieldLeftPadding: 29,
        inputFieldRightPadding: 77,
        inputFieldVerticalPadding: 17,
        sendButtonBottomAndRightPadding: 8,
    };

    return (
        <div
            className="chat-window"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#000000',
                height: '100vh',
                paddingBottom: 40,
                boxSizing: 'border-box'
            }}
        >
            <div 
                className="chat-window-header"
                style={{
                    width: 1098,
                    height: 54,
                    marginTop: 60,
                    marginBottom: 30
                }}
            >
                <img src="/onboarding/title_text.png" alt="Get Started with Jess" width={1098} height={54} />
            </div>
            <AssistantChat
                transformPrompt={(chatHistory: AnthropicObject[]) => {return chatHistory}}
                systemPrompt={ONBOARDING_SYSTEM_PROMPT}
                assistantTools={getOnboardingAssistantTools()}
                chatMessageItemResources={chatMessageItemResources}
                chatMessageItemSizeParams={chatMessageItemSizeParams}
                chatMessageListSizeParams={chatMessageListSizeParams}
                chatMessageInputBoxResources={chatMessageInputBoxResources}
                chatMessageInputBoxSizeParams={chatMessageInputBoxSizeParams}
                defaultChatHistory={ONBOARDING_INITIAL_MESSAGES}
                handleToolUse={(tool_name, tool_input) => {
                    return null;
                }}
            />
        </div>
    );
};

export default OnboardingPage;