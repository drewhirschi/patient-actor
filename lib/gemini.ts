import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { Message } from "./types"
import { generatePrompt } from "./prompt-utils"
import type { StructuredPrompt } from "./prompt-utils"

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
    demographics: string
    chiefComplaint: string
    medicalHistory: string
    medications: string
    socialHistory: string
    personality: string
    physicalFindings: string
    additionalSymptoms: string
    revelationLevel: string
    stayInCharacter: boolean
    avoidMedicalJargon: boolean
    provideFeedback: boolean
    customInstructions: string
    prompt?: string | null // Legacy field for backward compatibility
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

    // Build system prompt from structured fields
    const structuredData: StructuredPrompt = {
        demographics: patient.demographics || '',
        chiefComplaint: patient.chiefComplaint || '',
        medicalHistory: patient.medicalHistory || '',
        medications: patient.medications || '',
        socialHistory: patient.socialHistory || '',
        personality: patient.personality || '',
        physicalFindings: patient.physicalFindings || '',
        additionalSymptoms: patient.additionalSymptoms || '',
        revelationLevel: (patient.revelationLevel as 'forthcoming' | 'moderate' | 'reserved') || 'moderate',
        stayInCharacter: patient.stayInCharacter ?? true,
        avoidMedicalJargon: patient.avoidMedicalJargon ?? true,
        provideFeedback: patient.provideFeedback ?? true,
        customInstructions: patient.customInstructions || '',
    }

    // Generate the system prompt dynamically
    const systemPrompt = patient.prompt || generatePrompt(structuredData)

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
