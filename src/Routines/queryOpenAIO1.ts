import axios from "axios";
import {OPENROUTER_API_KEY} from "../secrets";

async function queryOpenAIO1(prompts: Array<string>): Promise<string> {
    let messages: Array<{role: string, content: string}> = [];

    for (const prompt of prompts) {
        messages.push({'role': 'user', 'content': prompt});
        try {
            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: process.env.REACT_APP_DEBUG_MODE === 'true'
                    ? "anthropic/claude-3.5-sonnet"  // Debug model
                    : "openai/o1-preview",           // Regular model,
                messages: messages,
            }, {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Received response from o1: ", response.data);

            messages.push({'role': 'assistant', 'content': response.data.choices[0].message.content});
        } catch (error) {
            console.error('Error making request:', error);
            throw error;
        }
    }

    return messages.slice(-1)[0].content;
}


export { queryOpenAIO1 };