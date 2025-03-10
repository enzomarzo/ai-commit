export type Provider = "openai" | "ollama";
export type Model = "gpt-4o-mini" | "gpt-3.5-turbo" | "mistral";

export interface SendMessageOptions {
  apiKey: string;
  model: Model;
}
