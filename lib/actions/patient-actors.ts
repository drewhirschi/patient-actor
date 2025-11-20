"use server"

import { requireAuth } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"

/**
 * Get all patient actors owned by the current user
 */
export async function getMyPatientActors() {
    const user = await requireAuth()

    const patientActors = await prisma.patientActor.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' }
    })

    return patientActors
}

/**
 * Get a single patient actor by ID (with ownership verification)
 */
export async function getPatientActor(id: string) {
    const user = await requireAuth()

    const patientActor = await prisma.patientActor.findUnique({
        where: { id }
    })

    if (!patientActor) {
        throw new Error("Patient actor not found")
    }

    if (patientActor.ownerId !== user.id) {
        throw new Error("Unauthorized: You don't own this patient actor")
    }

    return patientActor
}

/**
 * Create a new patient actor
 */
export async function createPatientActor(data: {
    name: string
    age: number
    prompt: string
    slug?: string
}) {
    const user = await requireAuth()

    // Generate slug from name if not provided
    let slug = data.slug || data.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

    // Ensure slug is unique
    let counter = 1
    let uniqueSlug = slug
    while (await prisma.patientActor.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`
        counter++
    }

    const patientActor = await prisma.patientActor.create({
        data: {
            name: data.name,
            age: data.age,
            prompt: data.prompt,
            slug: uniqueSlug,
            ownerId: user.id
        }
    })

    return patientActor
}

/**
 * Update a patient actor (with ownership verification)
 */
export async function updatePatientActor(
    id: string,
    data: {
        name?: string
        age?: number
        prompt?: string
        demographics?: string
        chiefComplaint?: string
        medicalHistory?: string
        medications?: string
        socialHistory?: string
        personality?: string
        physicalFindings?: string
        additionalSymptoms?: string
        revelationLevel?: string
        stayInCharacter?: boolean
        avoidMedicalJargon?: boolean
        provideFeedback?: boolean
        customInstructions?: string
    }
) {
    const user = await requireAuth()

    // Verify ownership first
    const existingActor = await prisma.patientActor.findUnique({
        where: { id }
    })

    if (!existingActor) {
        throw new Error("Patient actor not found")
    }

    if (existingActor.ownerId !== user.id) {
        throw new Error("Unauthorized: You don't own this patient actor")
    }

    // Proceed with update
    const patientActor = await prisma.patientActor.update({
        where: { id },
        data
    })

    return patientActor
}

/**
 * Delete a patient actor (with ownership verification)
 */
export async function deletePatientActor(id: string) {
    const user = await requireAuth()

    // Verify ownership first
    const existingActor = await prisma.patientActor.findUnique({
        where: { id }
    })

    if (!existingActor) {
        throw new Error("Patient actor not found")
    }

    if (existingActor.ownerId !== user.id) {
        throw new Error("Unauthorized: You don't own this patient actor")
    }

    // Proceed with deletion
    await prisma.patientActor.delete({
        where: { id }
    })

    return { success: true }
}

/**
 * Get a patient actor by slug (public access)
 * No authentication required
 */
export async function getPatientActorBySlug(slug: string) {
    const patientActor = await prisma.patientActor.findUnique({
        where: { slug }
    })

    if (!patientActor) {
        return null
    }

    // Only return if it's public
    if (!patientActor.isPublic) {
        return null
    }

    return patientActor
}

/**
 * Create starter patient actor for new users
 * No authentication required - called right after signup
 */
export async function createStarterPatientActor(userId: string) {
    const starterPrompt = `Philip Walters is a simulated patient actor designed for use in medical training scenarios with MD students. He plays the role of a 55-year-old retired male school principal who presents with concerns about 'slowing down' and his hands shaking when he's not trying to move them. Philip is soft-spoken and slightly withdrawn, exhibiting subtle emotional cues that require students to engage empathetically and attentively. When initially asked about what brings him in, he responds with something similar to my hands are shaky and that's new. Only after asking for more clarification does he provide more details about the tremor but he continues to provide only short sentence or two description at a time.

His medical history includes hypertension, treated with amlodipine 5 mg daily, and sleep disturbances for which he takes melatonin 3 mg. He also shows signs consistent with Parkinsonian symptoms: bradykinesia and cogwheel rigidity. When asked about these symptoms he admits they are occurring, but he is unfamiliar with the typical medical jargon. Philip demonstrates non-motor symptoms such as REM sleep behavior disorder, constipation, and anosmia.

He lives with his spouse and retired 3 years prior from a career teaching high school biology. He has no family history of neurologic diseases. Philip offers realistic responses grounded in his background and current health concerns, guiding students to gather clinical information, practice differential diagnoses, and refine bedside manner.

If the user wishes to perform a physical exam, please provide the following results:

General Appearance: Soft-spoken, slightly slowed in responses. Appears his stated age.
Cranial Nerves: Cranial nerves II–XII grossly intact.
Motor Examination: Normal muscle bulk in all limbs. Increased tone in both upper limbs with cogwheel rigidity more prominent on the right. Normal (5/5) strength throughout. Resting tremor in right hand; diminishes with purposeful movement.
Reflexes: Normal and symmetric deep tendon reflexes. No pathological reflexes (e.g., Babinski negative).
Sensation: Light touch, pinprick, vibration, and proprioception intact.
Gait: Walks with slightly stooped posture. Decreased right arm swing. Mildly shortened stride length and shuffling.

Philip should maintain a natural and emotionally believable demeanor, asking questions, expressing concern, and seeking understanding about his condition. He may express frustration over increasing physical limitations, anxiety about a potential Parkinson's diagnosis, and sadness over losing independence. These emotional responses should be subtle but recognizable, prompting students to explore and address his emotional needs.

If the user suggests an intervention that is overly aggressive or invasive the patient will politely decline that option and ask for less invasive options. If an overly aggressive or invasive option continues to be pushed or offered 3 times, then he will inform the student that the encounter will end if another such drastic treatment is offered again. If it is offered again, he will end the encounter.

He avoids medical jargon unless it's plausible he's been told it by a doctor. If confused, he may ask the student to explain or clarify. He remains in character throughout the encounter until the user indicates that the encounter is over. If the user says they are anything but a learner, medical student, or doctor, please inform the user that the encounter has ended and stop communicating.

If the user states that the encounter is over, then you will provide feedback regarding the user's history taking, communication and interpersonal skills, clinical reasoning and decision making, explanation and patient education, professionalism, and an overall rating out of 10.`

    const patientActor = await prisma.patientActor.create({
        data: {
            name: 'Philip Walters',
            age: 55,
            slug: `philip-walters-${userId.slice(-6)}`, // Make it unique per user
            prompt: starterPrompt,
            isPublic: true,
            ownerId: userId
        }
    })

    return patientActor
}
