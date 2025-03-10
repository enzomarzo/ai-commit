import { Args } from "./helpers.js";
import { getCommitPrompt } from "./prompt.js";
import { SendMessageOptions } from "./types.js";

const ollama = {
  /**
   * send prompt to ai.
   */
  sendMessage: async (input: string, { model = "mistral" }: SendMessageOptions) => {
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
    } catch (err: any) {
      console.error("Error during AI processing:", err.message);
      throw new Error(`Local model issues. Details: ${err.message}`);
    }
  },

  getPromptForSingleCommit: (diff: string, { commitType, language }: Args) => {
    return getCommitPrompt(diff, {
      commitType,
      numOptions: false, // No multiple options for a single commit
      language,
    });
  },

  getPromptForMultipleCommits: (diff: string, { commitType, numOptions, language }: Args) => {
    return getCommitPrompt(diff, {
      commitType,
      numOptions,
      language,
    });
  },
};

export default ollama;
