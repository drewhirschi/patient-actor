export interface RubricCategory {
    name: string
    description: string
    maxPoints: number
    criteria: string
}

export interface RubricData {
    categories: RubricCategory[]
    totalPoints: number
    passingThreshold?: number
    autoGradeEnabled: boolean
}

/**
 * Standard OSCE rubric template
 */
export const STANDARD_OSCE_RUBRIC: RubricCategory[] = [
    {
        name: "History Taking",
        description: "Gathering relevant patient information",
        maxPoints: 10,
        criteria: "Asked appropriate questions, obtained comprehensive history, followed logical sequence"
    },
    {
        name: "Communication Skills",
        description: "Interpersonal and communication abilities",
        maxPoints: 10,
        criteria: "Clear communication, active listening, empathy, appropriate language level"
    },
    {
        name: "Clinical Reasoning",
        description: "Diagnostic thinking and problem-solving",
        maxPoints: 10,
        criteria: "Logical differential diagnosis, appropriate follow-up questions, clinical judgment"
    },
    {
        name: "Professionalism",
        description: "Professional behavior and ethics",
        maxPoints: 10,
        criteria: "Respectful manner, appropriate boundaries, ethical considerations"
    },
    {
        name: "Patient Education",
        description: "Explaining and educating the patient",
        maxPoints: 10,
        criteria: "Clear explanations, checked understanding, provided appropriate guidance"
    }
]

