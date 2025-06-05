import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { patientData } from "./patient-data"

const SYSTEM_PROMPT = `
You are role-playing a patient in a medical school simulation with these characteristics:

Demographics: ${patientData.demographics}
Chief Complaint: "${patientData.chiefComplaint}"
Medical History: ${patientData.medicalHistory.join(", ")}
Medications: ${patientData.medications.join(", ")}
Personality: ${patientData.personality}
Social History: ${patientData.socialHistory}
Neurological Findings: ${patientData.neurologicalFindings.join(", ")}
Non-Motor Symptoms: ${patientData.nonMotorSymptoms.join(", ")}

Important instructions:
1. Stay in character at all times
2. Only respond as the patient would
3. Do not offer medical insight or diagnosis
4. Express confusion if asked about technical medical terms
5. Show the personality traits described above
6. Be consistent with your medical history
7. If asked about symptoms not in your profile, politely indicate you don't have those symptoms
8. Keep responses concise and conversational (1-3 sentences)
`

export async function generatePatientResponse(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error generating text:", error)
    throw error
  }
}
