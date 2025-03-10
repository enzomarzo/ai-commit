import * as dotenv from "dotenv";
import { getArgs } from "./helpers.js";
dotenv.config();
export const args = getArgs();
export const AI_PROVIDER = args.PROVIDER || process.env.PROVIDER || "openai";
export const MODEL = args.MODEL || process.env.MODEL || "gpt-3.5-turbo";
