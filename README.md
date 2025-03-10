<p align="center"><img width="400px" alt="Via Protocol is the most advanced cross-chain aggregation protocol" src="https://user-images.githubusercontent.com/20267733/218333677-ebdb09e5-9487-434c-92f5-f4bdcc76f632.png" width="100%">
</p>

# **AI-Commit: The Commit Message Generator**

This package uses the power of OpenAI's GPT-3.5-turbo model to understand your code changes and generate meaningful commit messages for you. Whether you're working on a solo project or collaborating with a team, AI-Commit makes it easy to keep your commit history organized and informative.


## How it Works
1. Install AI-Commit using `npm install -g ai-commit`
2. Generate an OpenAI API key [here](https://platform.openai.com/account/api-keys )
3. Set your `OPENAI_API_KEY` environment variable to your API key
1. Make your code changes and stage them with `git add .`
2. Type `ai-commit` in your terminal
3. AI-Commit will analyze your changes and generate a commit message
4. Approve the commit message and AI-Commit will create the commit for you ✅

## Using local model (ollama)

You can also use the local model for free with Ollama.

1. Install AI-Commit using `npm install -g ai-commit`
2. Install Ollama from https://ollama.ai/
3. Run `ollama run mistral` to fetch model for the first time
4. Set `PROVIDER` in your environment to `ollama`
1. Make your code changes and stage them with `git add .`
2. Type `ai-commit` in your terminal
3. AI-Commit will analyze your changes and generate a commit message
4. Approve the commit message and AI-Commit will create the commit for you ✅

## Options
`--list`: Select from a list of 5 generated messages (or regenerate the list)

`--force`: Automatically create a commit without being prompted to select a message (can't be used with `--list`)

`--apiKey`: Your OpenAI API key. It is not recommended to pass `apiKey` here, it is better to use `env` variable

`--language`: Specify the language to use for the commit message(default: `english`). e.g. `--language english`

`--commit-type`: Specify the type of commit to generate. This will be used as the type in the commit message e.g. `--commit-type feat`


## License
AI-Commit is licensed under the MIT License.

## Happy coding 🚀
