/**
 * Utility functions for parsing and generating patient actor prompts
 */

export interface StructuredPrompt {
    // Tab 1: Patient Profile
    demographics: string
    chiefComplaint: string
    medicalHistory: string
    medications: string
    socialHistory: string
    personality: string

    // Tab 2: Clinical Findings
    physicalFindings: string
    additionalSymptoms: string

    // Tab 3: Behavior Settings
    revelationLevel: 'forthcoming' | 'moderate' | 'reserved'
    stayInCharacter: boolean
    avoidMedicalJargon: boolean
    provideFeedback: boolean
    customInstructions: string
}

export const DEFAULT_STRUCTURED_PROMPT: StructuredPrompt = {
    demographics: '',
    chiefComplaint: '',
    medicalHistory: '',
    medications: '',
    socialHistory: '',
    personality: '',
    physicalFindings: '',
    additionalSymptoms: '',
    revelationLevel: 'moderate',
    stayInCharacter: true,
    avoidMedicalJargon: true,
    provideFeedback: true,
    customInstructions: '',
}

/**
 * Generate a complete prompt from structured data
 */
export function generatePrompt(data: StructuredPrompt): string {
    const sections: string[] = []

    // Patient Profile Section
    if (data.demographics) {
        sections.push(`**Demographics:** ${data.demographics}`)
    }

    if (data.chiefComplaint) {
        sections.push(`**Chief Complaint:** "${data.chiefComplaint}"`)
    }

    if (data.medicalHistory) {
        sections.push(`**Medical History:** ${data.medicalHistory}`)
    }

    if (data.medications) {
        sections.push(`**Current Medications:** ${data.medications}`)
    }

    if (data.socialHistory) {
        sections.push(`**Social History:** ${data.socialHistory}`)
    }

    if (data.personality) {
        sections.push(`**Personality:** ${data.personality}`)
    }

    // Clinical Findings Section
    if (data.physicalFindings) {
        sections.push(`\n**Physical/Neurological Findings:**\n${data.physicalFindings}`)
    }

    if (data.additionalSymptoms) {
        sections.push(`**Additional Symptoms:**\n${data.additionalSymptoms}`)
    }

    // Behavior Instructions
    const behaviorInstructions: string[] = []

    // Revelation level instructions
    if (data.revelationLevel === 'forthcoming') {
        behaviorInstructions.push(
            'Provide detailed information readily when asked. Be open and communicative about symptoms and concerns.'
        )
    } else if (data.revelationLevel === 'reserved') {
        behaviorInstructions.push(
            'Only reveal information when directly asked specific questions. Provide brief, minimal responses initially. Require follow-up questions to elaborate on symptoms.'
        )
    } else { // moderate
        behaviorInstructions.push(
            'Provide concise responses initially. Offer more details when asked follow-up questions. Balance between being helpful and realistic.'
        )
    }

    if (data.stayInCharacter) {
        behaviorInstructions.push(
            'Stay in character at all times throughout the encounter.',
            'Respond only as the patient would, not as a medical professional.'
        )
    }

    if (data.avoidMedicalJargon) {
        behaviorInstructions.push(
            'Avoid using medical jargon unless it\'s plausible the patient has been told it by a doctor.',
            'Express confusion if asked about technical medical terms you wouldn\'t know.',
            'Ask the student to explain or clarify medical terms you don\'t understand.'
        )
    }

    behaviorInstructions.push(
        'Be consistent with your medical history and symptoms.',
        'If asked about symptoms not in your profile, politely indicate you don\'t have those symptoms.',
        'Keep responses conversational and natural (1-3 sentences typically).'
    )

    if (data.provideFeedback) {
        behaviorInstructions.push(
            '\n**End of Encounter Feedback:**',
            'If the user indicates the encounter is over, provide constructive feedback on:',
            '- History taking',
            '- Communication and interpersonal skills',
            '- Clinical reasoning and decision making',
            '- Explanation and patient education',
            '- Professionalism',
            '- Overall rating out of 10'
        )
    }

    if (behaviorInstructions.length > 0) {
        sections.push(`\n**Instructions for Interaction:**\n${behaviorInstructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`)
    }

    // Custom instructions
    if (data.customInstructions) {
        sections.push(`\n**Additional Instructions:**\n${data.customInstructions}`)
    }

    return sections.join('\n\n')
}

/**
 * Parse an existing prompt back into structured data
 * This is a best-effort parser that looks for common patterns
 */
export function parsePrompt(prompt: string): StructuredPrompt {
    const result = { ...DEFAULT_STRUCTURED_PROMPT }

    // Helper to extract content after a label
    const extractAfterLabel = (label: string): string => {
        const regex = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]+?)(?=\\n\\*\\*|\\n\\n|$)`, 'i')
        const match = prompt.match(regex)
        return match ? match[1].trim().replace(/^["']|["']$/g, '') : ''
    }

    // Extract each field
    result.demographics = extractAfterLabel('Demographics')
    result.chiefComplaint = extractAfterLabel('Chief Complaint')
    result.medicalHistory = extractAfterLabel('Medical History')
    result.medications = extractAfterLabel('Current Medications') || extractAfterLabel('Medications')
    result.socialHistory = extractAfterLabel('Social History')
    result.personality = extractAfterLabel('Personality')
    result.physicalFindings = extractAfterLabel('Physical/Neurological Findings') || extractAfterLabel('Neurological Findings')
    result.additionalSymptoms = extractAfterLabel('Additional Symptoms') || extractAfterLabel('Non-Motor Symptoms')

    // Detect revelation level from text patterns
    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes('brief') && lowerPrompt.includes('minimal') || lowerPrompt.includes('only reveal information when directly asked')) {
        result.revelationLevel = 'reserved'
    } else if (lowerPrompt.includes('detailed information readily') || lowerPrompt.includes('open and communicative')) {
        result.revelationLevel = 'forthcoming'
    } else {
        result.revelationLevel = 'moderate'
    }

    // Detect behavior settings
    result.stayInCharacter = lowerPrompt.includes('stay in character') || lowerPrompt.includes('maintain character')
    result.avoidMedicalJargon = lowerPrompt.includes('avoid') && lowerPrompt.includes('jargon')
    result.provideFeedback = lowerPrompt.includes('feedback') || lowerPrompt.includes('rating')

    // Extract custom instructions (everything after "Additional Instructions")
    const customMatch = prompt.match(/\*\*Additional Instructions:\*\*\s*\n([\s\S]+)$/i)
    if (customMatch) {
        result.customInstructions = customMatch[1].trim()
    }

    return result
}
