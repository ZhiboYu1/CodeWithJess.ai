import axios from "axios";

async function queryOpenAIO1(prompts: Array<string>): Promise<string> {
    let messages: Array<{role: string, content: string}> = [];

    for (const prompt of prompts) {
        messages.push({'role': 'user', 'content': prompt});
        try {
            const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: "openai/o1-preview",
                messages: messages,
            }, {
                headers: {
                    "Authorization": `Bearer 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`,
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