#!/usr/bin/env node
"use strict";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { checkGitRepository } from "./helpers.js";
import { AI_PROVIDER, MODEL, args } from "./config.js";
import openai from "./openai.js";
import ollama from "./ollama.js";
const REGENERATE_MSG = "♻️ Regenerate Commit Messages";
console.log("Ai provider: ", AI_PROVIDER);
const apiKey = (args.apiKey || process.env.OPENAI_API_KEY || "");
const language = args.language || process.env.AI_COMMIT_LANGUAGE || "english";
if (AI_PROVIDER === "openai" && !apiKey) {
    console.error("Please set the OPENAI_API_KEY environment variable.");
    process.exit(1);
}
const commitType = args["commit-type"];
const provider = AI_PROVIDER === "ollama" ? ollama : openai;
const makeCommit = (input) => {
    console.log("Committing Message... 🚀 ");
    execSync(`git commit -F -`, { input: input.trim() });
    console.log("Commit Successful! 🎉");
};
const getPromptForSingleCommit = (diff) => {
    return provider.getPromptForSingleCommit(diff, {
        commitType,
        language,
    });
};
const generateSingleCommit = async (diff) => {
    const prompt = getPromptForSingleCommit(diff);
    const finalCommitMessage = await provider.sendMessage(prompt, { apiKey, model: MODEL });
    console.log(`\nProposed Commit:\n--------------------------\n${finalCommitMessage}\n--------------------------\n`);
    if (args.force) {
        makeCommit(finalCommitMessage);
        return;
    }
    const answer = await inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Do you want to continue?",
            default: true,
        },
    ]);
    if (!answer.continue) {
        console.log("Commit aborted by user 🙅‍♂️");
        process.exit(1);
    }
    makeCommit(finalCommitMessage);
};
const generateListCommits = async (diff, numOptions = "5") => {
    const prompt = provider.getPromptForMultipleCommits(diff, {
        commitType,
        numOptions,
        language,
    });
    const text = await provider.sendMessage(prompt, { apiKey, model: MODEL });
    // Split the generated options (separated by newlines)
    let msgs = text.split("\n").map((msg) => msg.trim()).filter((msg) => msg);
    // Add the regenerate option
    msgs.push(REGENERATE_MSG);
    // Allow user to select one of the generated options
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "commit",
            message: "Select a commit message",
            choices: msgs,
        },
    ]);
    // If the user selects the regenerate option, ask to regenerate commit messages
    if (answer.commit === REGENERATE_MSG) {
        await generateListCommits(diff);
        return;
    }
    // Make the selected commit
    makeCommit(answer.commit);
};
// Add this function after imports
const filterLockFiles = (diff) => {
    const lines = diff.split("\n");
    let isLockFile = false;
    const filteredLines = lines.filter((line) => {
        if (line.match(/^diff --git a\/(.*\/)?(yarn\.lock|pnpm-lock\.yaml|package-lock\.json)/)) {
            isLockFile = true;
            return false;
        }
        if (isLockFile && line.startsWith("diff --git")) {
            isLockFile = false;
        }
        return !isLockFile;
    });
    return filteredLines.join("\n");
};
async function generateAICommit() {
    const isGitRepository = checkGitRepository();
    if (!isGitRepository) {
        console.error("This is not a git repository 🙅‍♂️");
        process.exit(1);
    }
    let diff = execSync("git diff --staged").toString();
    // Filter lock files
    const originalDiff = diff;
    diff = filterLockFiles(diff);
    // Check if lock files were changed
    if (diff !== originalDiff) {
        console.log("Changes detected in lock files. These changes will be included in the commit but won't be analyzed for commit message generation.");
    }
    // Handle empty diff after filtering
    if (!diff.trim()) {
        console.log("No changes to commit except lock files 🙅");
        console.log("Maybe you forgot to add files? Try running git add . and then run this script again.");
        process.exit(1);
    }
    args.list ? await generateListCommits(diff) : await generateSingleCommit(diff);
}
await generateAICommit();
