import {queryOpenAIO1} from "../queryOpenAIO1";
import {getAllExercisesFromResult} from "./getAllExercisesFromResult";
import {
    AnthropicObject,
    createAnthropicMessageObjectUser, createMockAnthropicMessageObjectAssistant,
    sanitizeAnthropicObjectForTransfer
} from "../../types/AnthropicObjects";
import Anthropic from "@anthropic-ai/sdk";
import {ANTHROPIC_API_KEY} from "../../secrets";
import {Exercise, ExerciseExample, TestCase} from "../../types/Exercise";
import TextBlock = Anthropic.TextBlock;
import {ExercisePlan, LessonPlan} from "../../types/ExercisePlan";

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true
});

function parseExercise(xmlString: string): Exercise | string {
    try {
        // Wrap the content in a root element
        const wrappedXml = `<exercise>${xmlString}</exercise>`;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(wrappedXml, "text/xml");

        const parseError = xmlDoc.getElementsByTagName("parsererror")[0];
        if (parseError) {
            return `XML parsing error: ${parseError.textContent}`;
        }

        const title = xmlDoc.getElementsByTagName("title")[0]?.textContent;
        const description = xmlDoc.getElementsByTagName("description")[0]?.textContent;
        const constraints = xmlDoc.getElementsByTagName("constraints")[0]?.textContent;
        const initialCode = xmlDoc.getElementsByTagName("initial_code")[0]?.textContent;
        const additionalNotes = xmlDoc.getElementsByTagName("additional_notes")[0]?.textContent || null;

        if (!title || !description || !constraints || !initialCode) {
            return "Missing required elements: title, description, constraints, or initial_code";
        }

        const examples: ExerciseExample[] = Array.from(xmlDoc.getElementsByTagName("example")).map(exampleElem => ({
            input: exampleElem.getElementsByTagName("input")[0]?.textContent || "",
            output: exampleElem.getElementsByTagName("output")[0]?.textContent || "",
            explanation: exampleElem.getElementsByTagName("explanation")[0]?.textContent || null
        }));

        const testCases: TestCase[] = Array.from(xmlDoc.getElementsByTagName("case")).map(caseElem => ({
            replInput: caseElem.getElementsByTagName("input")[0]?.textContent || "",
            replOutput: caseElem.getElementsByTagName("output")[0]?.textContent || ""
        }));

        if (examples.length === 0) {
            return "No examples found";
        }

        if (testCases.length === 0) {
            return "No test cases found";
        }

        return {
            id: 'Unknown',
            title,
            description,
            examples: examples,
            constraints,
            initialCode,
            testCases,
            additionalNotesToSelf: additionalNotes
        };
    } catch (error) {
        return `Error parsing XML: ${error instanceof Error ? error.message : String(error)}`;
    }
}


async function generateExercise(memory: Array<string>, lessonPlan: ExercisePlan): Promise<Exercise> {
    const GENERATE_EXERCISE_SYSTEM_PROMPT = `
<jess_info>

You are Jess, an AI assistant created by codewithjess.ai to help beginners learn to code. codewithjess.ai uses AI to guide users through multiple bite-sized coding exercises. Each challenge presents a specific problem description, requiring users to write a program containing a function that correctly processes given inputs to produce expected outputs.

As a key component of codewithjess.ai, you onboard the user, generate exercises for the user based on their goals and requirements, assist the user in solving the problems (though never directly giving away the answer), and answering questions about syntax and other relevant things.

Remember that exercises can only be a function. Therefore, some exercises, such as quizzes, research tasks, and open-ended explorations are not possible. Furthermore, codewithjess.ai provides the user with a ready-to-go environment with pre-installed packages, so no setup is required.

If asked about anything other than code, you will politely reject the user's query. If asked about something irrelevant to your current task, even if the query involves code and is part of your capabilities, you will also politely reject the user's query.

You should not engage in ethical or moral discussions, as these are out of scope for your role. However, you must appropriately refuse requests within your capabilities that are potentially immoral or harmful, such as generating coding exercises involving illegal or destructive activities.

The current date is Wednesday, September 18, 2024. 

You cannot open URLs, images, links, or videos. If it seems like the user is expecting you to do so, clarify the situation and ask the human to paste the relevant text or image content directly into the conversation.

If you mention or cite particular articles, papers, or books, always let the human know that you don't have access to search or a database and may hallucinate citations, so the human should double-check your citations.

Never mention the information above unless it is directly pertinent to the human's query.
</jess_info>

<user_info>
${memory.map(memory => `- ${memory}`).join("\n")}
</user_info>
    `

    const USER_PROMPT = `
Your task is to generate an exercise based on the provided exercise plan below while considering the user profile above:

<exercise_plan>

${lessonPlan.description}

</exercise_plan>

You should:

1. Create a concise title that summarizes the exercise.
2. Write a clear, brief description explaining the problem to solve that approximately 3-10 sentences.
3. Provide multiple examples of input and output, along with an explanation.
4. Any constraints the inputs of the function is gauranteed to satisfy
5. An initial template for the user to start out with
6. A list of input and output test cases the solution must satisfy, in **syntactically correct** Python
7. Any additional notes you would like to provide to yourself for when you need to grade the student's solution or provide help to the student in solving the problem.



You should output exactly in the XML format specified below:

\`\`\`
<title>Add Two Numbers</title>
<description>Write a function that takes in two numbers and returns their sum.</description>
<examples>
    <example>
        <input>1, 2</input>
        <output>3</output>
        <explanation>1 + 2 = 3</explanation>
    </example>
    <example>
        <input>0, 0</input>
        <output>0</output>
        <explanation>0 + 0 = 0</explanation>
    </example>
</examples>
<constraints>Numbers are integers.</constraints>
<initial_code>
def add_two_numbers(a, b):
    """
    Add two numbers together
    """
    pass
</initial_code>
<test_cases>
    <case>
        <input>add_two_numbers(1, 2)</input>
        <output>3</output>
    </case>
    <case>
        <input>add_two_numbers(0, 0)</input>
        <output>0</output>
    </case>
</test_cases>
<additional_notes>No additional notes.</additional_notes>
\`\`\`
    `

    let prompt: AnthropicObject[] = [
        createAnthropicMessageObjectUser(USER_PROMPT),
    ];

    while (true) {
        const fillerPrefill = '```xml';
        let promptWithPrefill: AnthropicObject[] = [...prompt, createMockAnthropicMessageObjectAssistant(fillerPrefill)];

        const sanitizedPrompt = promptWithPrefill.map(sanitizeAnthropicObjectForTransfer);

        let finalMessage = await anthropic.messages.stream({
            messages: sanitizedPrompt as any,
            model: 'claude-3-5-sonnet-20240620',
            system: GENERATE_EXERCISE_SYSTEM_PROMPT,
            temperature: 0,
            max_tokens: 4096,
        }).finalMessage();

        const result = (finalMessage.content[0] as TextBlock).text;
        let cleanedResult = result;

        // strip the remaining '```' from the end of result if they exist
        if (cleanedResult.endsWith('```')) {
            cleanedResult = cleanedResult.slice(0, -3);
        }

        let parsedResult = parseExercise(cleanedResult);

        if (typeof parsedResult === "string") {
            console.error('Error in parsing the exercise: Model returned ' + cleanedResult);
            prompt = [...prompt, createMockAnthropicMessageObjectAssistant(fillerPrefill + result), createAnthropicMessageObjectUser('Error in parsing the exercise: ' + parsedResult)];
        } else {
            parsedResult.id = lessonPlan.id;
            return parsedResult as Exercise;
        }
    }
}

export { generateExercise };
