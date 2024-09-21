import React, {useState} from 'react';
import './Onboarding.css';
import { ChatDisplayItem, ChatUser } from "../../types/ChatDisplayItem";
import { ChatMessageListSizeParams } from "../../Components/Chat/ChatMessageList";
import { ChatMessageItemResources, ChatMessageItemSizeParams } from '../../Components/Chat/ChatMessageItem';
import { ChatMessageInputBox, ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams } from '../../Components/Chat/ChatMessageInputBox';
import AssistantChat from '../../Components/Chat/AssistantChat';

const OnboardingPage = () => {
    const [chatItems, setChatItems] = useState<ChatDisplayItem[]>([
        { sender: ChatUser.USER, message: "Hello, how are you?" },
        { sender: ChatUser.JESS, message: "Hi there! I'm doing well, thank you. How can I assist you today?" },
        { sender: ChatUser.USER, message: "I'm looking for some advice on starting a vegetable garden. Do you have any tips?" },
        { sender: ChatUser.JESS, message: "Absolutely! Starting a vegetable garden can be a rewarding experience. Here are a few tips to get you started: "}
    ]);

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
        <div className="chat-window" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', height: '100vh' }}>
            <AssistantChat
                getCustomPrompt={(prompt) => prompt}
                chatMessageItemResources={chatMessageItemResources}
                chatMessageItemSizeParams={chatMessageItemSizeParams}
                chatMessageListSizeParams={chatMessageListSizeParams}
                chatMessageInputBoxResources={chatMessageInputBoxResources}
                chatMessageInputBoxSizeParams={chatMessageInputBoxSizeParams}
            />
        </div>
    );
};

export default OnboardingPage;