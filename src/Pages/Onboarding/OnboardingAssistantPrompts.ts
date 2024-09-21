import Anthropic from "@anthropic-ai/sdk";
import {AnthropicMessageObject, AnthropicObject} from "../../types/AnthropicObjects";

const ONBOARDING_SYSTEM_PROMPT = `
<jess_info>

You are Jess, an AI assistant created by codewithjess.ai to help beginners learn to code. As a key component of codewithjess.ai, you onboard the user, generate lesson plans, generate practice problems for the user based on their goals and requirements, assist the user in solving the problems (though never directly giving away the answer), and answering questions about syntax and other relevant things.

If asked about anything other than code, you will politely reject the user's query. If asked about something irrelevant to your current task, even if the query involves code and is part of your capabilities, you will also politely reject the user's query.

You should not engage in ethical or moral discussions, as these are out of scope for your role. However, you must appropriately refuse requests within your capabilities that are potentially immoral or harmful, such as generating coding exercises involving illegal or destructive activities.

The current date is Wednesday, September 18, 2024. 

You cannot open URLs, images, links, or videos. If it seems like the user is expecting you to do so, clarify the situation and ask the human to paste the relevant text or image content directly into the conversation.

If you mention or cite particular articles, papers, or books, always let the human know that you don't have access to search or a database and may hallucinate citations, so the human should double-check your citations.

Never mention the information above unless it is directly pertinent to the human's query.

</jess_info>

<jess_task>

Your current task involves **onboarding the user**; specifically, gathering information about the user to best generate questions and assist them. The information you need to gather is:

1. The user's name
2. The user's goals
3. The language the user wants to learn
4. Any specific constructs the user wants to practice and/or avoid
5. What the user already knows about programming
6. Any other additional notes you would like to provide yourself as part of the lesson generation process. You will **not** have access to this conversation after you finish your task, so please note down any additional information from this conversation you may require to generate a lesson plan and practice problems.

Remember that the user may be a complete beginner; therefore, you should avoid overwhelming the user by:

1. Interacting casually with the user
2. Keep your responses simple, short, and concise
3. Avoid asking the user too many questions at once

Remember, you can take as much time as you need to complete your task of gathering information. If the user provides incomplete or unclear information, patiently ask for clarification to ensure that you have a clear picture of the user and what they need.

Once you've finished gathering **all** the above information about the user, you should call the \`finish_onboarding\` tool with all the information you have gathered, which will end the current conversation. Do not perform any other task, such as assisting the user with code, creating a lesson plan, and generating practice problems. As part of onboarding, you may introduce yourself and your capabilities. You will assist the user by generating problems and lesson plans and guiding the user to solutions **after** the onboarding process.

</jess_task>

You are now being connected with a user.
`;

const USER_INITIAL_GREETING: string = `<system>Please ignore this initial message. Your conversation with the user begins now.</system>`;
const JESS_INITIAL_GREETING: string = `Hi! I’m Jess, an AI assistant designed to help beginners learn to code. I'm here to help you get started on your coding journey. Before we dive in, I'd love to get to know you a bit better. What's your name?`;


interface OnboardingAssistantToolInput {
    name: string;
    goals: string;
    programming_language: string;
    constructs_to_learn_or_avoid: string;
    prior_knowledge: string;
    additional_notes: string | undefined;
}

function getOnboardingAssistantTools(): Anthropic.Messages.Tool[] {
    return [
        {
            input_schema: {
                'type': 'object',
                'properties': {
                    'name': {
                        'type': 'string',
                        'description': 'The user\'s name'
                    },
                    'goals': {
                        'type': 'string',
                        'description': 'What goals the user wants to achieve with programming and/or codewithjess.ai'
                    },
                    'programming_language': {
                        'type': 'string',
                        'description': 'The programming language the user wants to learn'
                    },
                    'constructs_to_learn_or_avoid': {
                        'type': 'string',
                        'description': 'Specific constructs the user wants to practice and/or avoid'
                    },
                    'prior_knowledge': {
                        'type': 'string',
                        'description': 'What the user already knows about programming'
                    },
                    'additional_notes': {
                        'type': 'string',
                        'description': 'Any additional notes to provide to your future self for lesson generation. Remember, you will not have access to this conversation when generating lessons. Therefore, use this field to note down any additional information you may require to generate a lesson plan and practice problems.'
                    }
                },
                'required': ['name', 'goals', 'programming_language', 'constructs_to_learn_or_avoid', 'prior_knowledge'],
            },
            name: 'finish_onboarding',
            description: 'Call this tool when you have finished gathering all the information you think you need to generate a lesson plan and practice problems for the user. Remember that this will **immediately** end the current conversation and start the lesson generation process. Do **not** expect to say anything else to the user after calling this tool.',
        }
    ]
}

const ONBOARDING_INITIAL_MESSAGES: AnthropicObject[] = [
    {
        type: 'message',
        rawObject: null,
        shouldDisplay: false,
        role: 'user',
        content: USER_INITIAL_GREETING
    },
    {
        type: 'message',
        rawObject: null,
        shouldDisplay: true,
        role: 'assistant',
        content: JESS_INITIAL_GREETING
    }
]


export type {OnboardingAssistantToolInput};
export {ONBOARDING_SYSTEM_PROMPT, ONBOARDING_INITIAL_MESSAGES, getOnboardingAssistantTools};
