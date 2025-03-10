import { getCommitPrompt } from "./prompt.js";
const ollama = {
    /**
     * send prompt to ai.
     */
    sendMessage: async (input, { model = "mistral" }) => {
        const url = "http://127.0.0.1:11434/api/chat";
        const messages = [{ role: "user", content: input }];
        const data = { model, stream: false, messages };
        console.log(`Prompting Ollama with model: ${model}...`);
        try {
            // Initial request
            const initialResponse = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const initialResult = await initialResponse.json();
            console.log("Initial answer from Ollama:", initialResult);
            const answer = initialResult.message;
            console.log("Response from Ollama:", answer.content);
            return answer.content;
        }
        catch (err) {
            console.error("Error during AI processing:", err.message);
            throw new Error(`Local model issues. Details: ${err.message}`);
        }
    },
    getPromptForSingleCommit: (diff, { commitType, language }) => {
        return getCommitPrompt(diff, {
            commitType,
            numOptions: false, // No multiple options for a single commit
            language,
        });
    },
    getPromptForMultipleCommits: (diff, { commitType, numOptions, language }) => {
        return getCommitPrompt(diff, {
            commitType,
            numOptions,
            language,
        });
    },
};
export default ollama;
