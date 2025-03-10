import { ChatGPTAPI } from "chatgpt";
import { getCommitPrompt } from "./prompt.js";
const openai = {
    sendMessage: async (input, { apiKey }) => {
        console.log("prompting chat gpt...");
        const api = new ChatGPTAPI({
            apiKey,
            completionParams: {
                model: "gpt-3.5-turbo",
                // model: "gpt-4o-mini",
            },
        });
        const { text } = await api.sendMessage(input);
        return text;
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
export default openai;
