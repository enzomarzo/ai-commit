import * as dotenv from "dotenv";
import { getArgs } from "./helpers.js";
import { Model, Provider } from "./types.js";

dotenv.config();

export const args = getArgs();

export const AI_PROVIDER: Provider = (args.PROVIDER as Provider) || (process.env.PROVIDER as Provider) || "openai";

export const MODEL: Model = (args.MODEL as Model) || (process.env.MODEL as Model) || "gpt-3.5-turbo";
