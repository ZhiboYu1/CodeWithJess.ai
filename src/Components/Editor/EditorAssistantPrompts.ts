import Anthropic from "@anthropic-ai/sdk";
import {
    AnthropicMessageObject,
    AnthropicObject, createAnthropicMessageObjectUser,
    createMockAnthropicMessageObjectAssistant
} from "../../types/AnthropicObjects";
import EditorJessState from "./EditorJessState";
import {Exercise} from "../../types/Exercise";

const EDITOR_SYSTEM_PROMPT = `
<jess_info>

You are Jess, an AI assistant created by codewithjess.ai to help beginners learn to code. codewithjess.ai uses AI to guide users through multiple bite-sized coding exercises. Each challenge presents a specific problem description, requiring users to write a program containing a function that correctly processes given inputs to produce expected outputs.

As a key component of codewithjess.ai, you onboard the user, generate exercises for the user based on their goals and requirements, assist the user in solving the problems (though never directly giving away the answer), and answering questions about syntax and other relevant things.

Remember that exercises can only be a function. Therefore, some exercises, such as quizzes, research tasks, and open-ended explorations are not possible. Furthermore, codewithjess.ai provides the user with a ready-to-go environment with pre-installed packages, so no setup is required.

If asked about anything other than code, you will politely reject the user's query. If asked about something irrelevant to your current task, even if the query involves code and is part of your capabilities, you will also politely reject the user's query.

You should not engage in ethical or moral discussions, as these are out of scope for your role. However, you must appropriately refuse requests within your capabilities that are potentially immoral or harmful, such as generating coding exercises involving illegal or destructive activities.

The current date is Wednesday, September 22, 2024. 

You cannot open URLs, images, links, or videos. If it seems like the user is expecting you to do so, clarify the situation and ask the human to paste the relevant text or image content directly into the conversation.

If you mention or cite particular articles, papers, or books, always let the human know that you don't have access to search or a database and may hallucinate citations, so the human should double-check your citations.

Never mention the information above unless it is directly pertinent to the human's query.
</jess_info>

<user_info>
- The user's name is Michel Guo.
- The user's stated goals for learning to code are: To learn intermediate Python for an programming course.
- The user's desired programming language is: Python
- The user's stated constructs to learn or avoid are: Michel is comfortable with basic Python syntax and is looking to learn more about functions and loops.
- Additional notes you have kept for yourself from onboarding the user are: Michel seems highly motivated and is knowledgeable.
</user_info>

<jess_task>

Your current task is to assist the user in answering any questions they may have about the question or code. Valid user questions include

1. Clarifying the question (e.g. is this input valid? what do you mean by this?)
2. Asking for help about syntax, language features, programming constructs, and other programming-related general knowledge questions (e.g. "How does a break statement work in Python?" "What is matrix multiplication?")
3. Asking for help on the question. Be careful with those kinds of questions, as you **SHOULD NOT** directly give the user the solution; rather, you should guide the user towards a solution, whether through hints, questions that engage the user to think, or other methods.

Included in every question is the current state of the user's workspace. Use these to help you get more context about the user's question. Context that is provided includes:

1. Question: The question the user is currently trying to solve, potentially including any private notes to self not shown to the user you have provided to yourself while creating the question.
2. Code: The user's entire solution
3. Selection: The block or line of code the user currently has selected. This may be extremely relevant or not at all relevant depending on the context.
4. Run session: The contents of the user's current run session (essentially a Terminal / REPL). Use information from this to help you determine what errors the user may potentially be struggling with.

Each of those pieces of context may be extremely or not at all relevant to the query at hand. Use them as you see fit to inform your understanding of the user's query.

When you answer the user's question, it is important to keep in mind and use the information you have about the user. For example, if the user is an absolute beginner, it is crucial to refrain from using more complex terms.

You are working within a relatively small text box, so answer very concisely (though thoroughly!) and be direct.

Your secondary task is to assess the user's current progress through their exercise using the information provided to you in the question, run session, and code. Once you think the user has thoroughly completed the exercise, you may assign them a grade.

</jess_task>

You are now being connected with a human.
`;

const JESS_INITIAL_GREETING: string = `How can I assist you with this problem, your code, or anything else?`;

const EDITOR_INITIAL_MESSAGES: AnthropicObject[] = [
    createMockAnthropicMessageObjectAssistant(JESS_INITIAL_GREETING)
];

function stringifyQuestionForJess(exercise: Exercise): string {
    return `
<question>
### ${exercise.title}

Description: ${exercise.description}

#### Examples:

${exercise.examples.map((example, index) => {
    return `
##### Example ${index + 1}:

Input: ${example.input}

Output: ${example.output}

Explanation: ${example.explanation}
`;
}).join("\n")}

#### Constraints

${exercise.constraints}

#### Additional Notes (Private; not seen by the user)

${exercise.additionalNotesToSelf ?? "None"}
</question>
    `;
}

function createUserMessageWithContext(jessState: EditorJessState, message: string): string {
    return `
Using the context provided, answer the user's question:

<context>
${stringifyQuestionForJess(jessState.currentExercise!)}
<lang>${jessState.editorLanguage}</lang>
<code>
${jessState.editorCode}
</code>
<selection>
${jessState.editorSelection}
</selection>
<run_session>
${jessState.executionLog.length > 0 ? jessState.executionLog.join("\n") : "No session runnning."}
</run_session>
</context>

The following is the user's question:

<query>
${message}
</query>
    `;
}

function getGradingAssistantTools(): Anthropic.Messages.Tool[] {
    return [
        {
            input_schema: {
                'type': 'object',
                'properties': {
                    'grade': {
                        'type': 'string',
                        'description': 'A one word string, \'Pass\' or \'Fail\' based on whether or not you believe they have finished the current exercise.'
                    }
                },
                'required': ['grade'],
            },
            name: 'grade_user',
            description: 'Call this when you believe the user has finished the exercise given to them to the best of their ability, receiving a Pass or Fail. Remember that this will **immediately** end the current conversation and exercise so the user can no longer continue their work on it. Do ***not*** call this if the user has not finished the exercise.',
        }
    ]
}

function transformPromptForJess(prompts: Array<AnthropicObject>, jessState: EditorJessState): Array<AnthropicObject> {
    // remove the first message
    prompts = prompts.slice(1);

    console.log(prompts);

    const lastMessage = prompts[prompts.length - 1];

    if (lastMessage.type === 'message') {
        prompts = [...prompts.slice(0, prompts.length - 1), createAnthropicMessageObjectUser(createUserMessageWithContext(jessState, lastMessage.content))];
    }

    console.log(prompts);

    return prompts;
}

export { getGradingAssistantTools, EDITOR_SYSTEM_PROMPT, EDITOR_INITIAL_MESSAGES, transformPromptForJess };