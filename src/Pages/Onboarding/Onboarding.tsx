import React, { useState } from 'react';
import './Onboarding.css';
import {ChatMessageListSizeParams} from "../../Components/Chat/ChatMessageList";
import {ChatMessageItemResources, ChatMessageItemSizeParams} from '../../Components/Chat/ChatMessageItem';
import {ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams} from '../../Components/Chat/ChatMessageInputBox';
import AssistantChat from '../../Components/Chat/AssistantChat';
import {
    getOnboardingAssistantTools,
    ONBOARDING_INITIAL_MESSAGES, ONBOARDING_SYSTEM_PROMPT,
    OnboardingAssistantToolInput,
} from "./OnboardingAssistantPrompts";
import {AnthropicObject} from "../../types/AnthropicObjects";
import {generateLessonPlan} from "../../Routines/LessonPlan/generateLessonPlan";
import ModalView from '../../Components/ModalView';
import {onboardingToMemory} from "../../Routines/Onboarding/onboardingToMemory";
import {generateExercise} from "../../Routines/LessonPlan/generateExercise";
import {onboardingInitializeAppState} from "../../Routines/Onboarding/onboardingInitializeAppState";
import {useNavigate} from "react-router-dom";

const OnboardingPage = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

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
        <div>
            <ModalView
                isVisible={isLoading}
                icon="/onboarding/loading_sparkles.png"
                iconWidth={135}
                iconHeight={135}
                titleImageTopMargin={41}
                titleImage="/onboarding/loading_text.png"
                titleImageWidth={770}
                titleImageHeight={54}
                messageImageTopMargin={13}
                messageImage="/onboarding/loading_description.png"
                messageImageWidth={572}
                messageImageHeight={72}
                onTap={() => {console.log("tapped")}}
                children={
                    <div
                        className="chat-window"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#000000',
                            height: '100vh',
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
                        <div
                            style={{
                                marginBottom: 40,
                                height: 'calc(100% - 54px - 60px - 30px - 40px)',
                            }}
                        >
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
                                    if (tool_name !== "finish_onboarding") {
                                        // error
                                        return null;
                                    }
                                    let onboardingData: OnboardingAssistantToolInput = tool_input;

                                    setIsLoading(true);

                                    onboardingInitializeAppState(onboardingData).then(() => {
                                        navigate('/editor', { replace: true });
                                    });

                                    return null;
                                }}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default OnboardingPage;