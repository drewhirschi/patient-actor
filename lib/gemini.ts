import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { Message } from "./types"

// Initialize Google AI with API key from environment
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!apiKey) {
    console.error(
        "❌ Google Generative AI API key is missing. Please set GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file."
    )
}

export interface PatientActor {
    name: string
    age: number
    prompt: string
}

export async function generatePatientResponse(
    patient: PatientActor,
    messages: Message[]
): Promise<string> {
    if (!apiKey) {
        throw new Error(
            "Google Generative AI API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file."
        )
    }

    // Use the prompt directly as the system prompt
    const systemPrompt = patient.prompt

    const conversationHistory = messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
    }))

    const result = await generateText({
        model: google("gemini-2.0-flash"),
        system: systemPrompt,
        messages: conversationHistory,
    })

    return result.text
}
