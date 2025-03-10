import { ChatGPTAPI } from "chatgpt";
import { getCommitPrompt } from "./prompt.js";
import { Args } from "./helpers.js";

interface SendMessageOptions {
  apiKey: string;
}

const openai = {
  sendMessage: async (input: string, { apiKey }: SendMessageOptions): Promise<string> => {
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

  getPromptForSingleCommit: (diff: string, { commitType, language }: Args): string => {
    return getCommitPrompt(diff, {
      commitType,
      numOptions: false, // No multiple options for a single commit
      language,
    });
  },

  getPromptForMultipleCommits: (diff: string, { commitType, numOptions, language }: Args): string => {
    return getCommitPrompt(diff, {
      commitType,
      numOptions,
      language,
    });
  },
};

export default openai;
