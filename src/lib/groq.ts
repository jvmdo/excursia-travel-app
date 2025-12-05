import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const groq = new Groq({ apiKey: GROQ_API_KEY });
