import { execSync } from "child_process";

export const getCommitPrompt = (diff, { commitType, numOptions, language }) => {
  const projectTicketName = "ARWDT";
  const currentBranch = execSync("git branch --show-current").toString().trim();
  const getTicketId = currentBranch.match(new RegExp(`${projectTicketName}-\\d+`));
  const ticketID = getTicketId ? getTicketId[0] : null;

  // Define the prefix based on commitType and ticketID
  let prefix = "";
  if (commitType && ticketID) {
    prefix = `${commitType}: ${ticketID} `;
  } else if (ticketID) {
    prefix = `${ticketID} `;
  } else if (commitType) {
    prefix = `${commitType}: `;
  }

  const basePrompt = `
      You are a highly skilled developer who writes concise, clear, and professional Git commit messages. Your task is to generate a commit message based on the diff below.
      consider the Prefix = ${prefix || "n/a"}.

      **Follow these rules strictly:**
      - Keep the summary under 50 characters while clearly describing the change.
      - Use the present tense and be specific (e.g., "Fix bug" instead of "Fixed bug" or "Fixes bug").
      - If multiple changes exist, use bullet points in the body for clarity.
      - Do not use vague terms like "refactor. Be specific about the change."
      - if a prefix is not n/a, include a prefix in the message.
      - Write the message in ${language}.

      **Git Diff:**\n\`\`\`\n${diff}\n\`\`\`
    `;

  if (numOptions) {
    // For multiple commit options
    return `
        ${basePrompt}
        Generate exactly **${numOptions} commit message options**, each under 50 characters. 
        Separate them with semicolons (e.g., Option 1; Option 2).
      `;
  } else {
    // For a single commit message
    return `
        ${basePrompt}
        Please provide a single commit message that follows the rules above. Make it informative, clear, and focused on the specific changes. 
      `;
  }
};
