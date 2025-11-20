"use server"

import { requireAuth } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import type { RubricData } from "@/lib/types/rubric"

/**
 * Get rubric for a patient actor
 */
export async function getRubricByPatientActor(patientActorId: string) {
    try {
        const user = await requireAuth()

        // Get patient actor to verify ownership
        const patientActor = await prisma.patientActor.findUnique({
            where: { id: patientActorId },
            include: { gradingRubric: true }
        })

        if (!patientActor) {
            throw new Error("Patient actor not found")
        }

        if (patientActor.ownerId !== user.id) {
            throw new Error("Unauthorized: You don't own this patient actor")
        }

        return patientActor.gradingRubric
    } catch (error) {
        console.error("Error fetching rubric:", error)
        throw new Error(
            error instanceof Error ? error.message : "Failed to fetch rubric"
        )
    }
}

/**
 * Create or update rubric for a patient actor
 */
export async function upsertRubric(
    patientActorId: string,
    rubricData: RubricData
) {
    try {
        const user = await requireAuth()

        // Verify ownership of patient actor
        const patientActor = await prisma.patientActor.findUnique({
            where: { id: patientActorId }
        })

        if (!patientActor) {
            throw new Error("Patient actor not found")
        }

        if (patientActor.ownerId !== user.id) {
            throw new Error("Unauthorized: You don't own this patient actor")
        }

        // Upsert the rubric
        const rubric = await prisma.gradingRubric.upsert({
            where: { patientActorId },
            create: {
                patientActorId,
                categories: rubricData.categories as any,
                totalPoints: rubricData.totalPoints,
                passingThreshold: rubricData.passingThreshold,
                autoGradeEnabled: rubricData.autoGradeEnabled,
            },
            update: {
                categories: rubricData.categories as any,
                totalPoints: rubricData.totalPoints,
                passingThreshold: rubricData.passingThreshold,
                autoGradeEnabled: rubricData.autoGradeEnabled,
            },
        })

        return rubric
    } catch (error) {
        console.error("Error upserting rubric:", error)
        throw new Error(
            error instanceof Error ? error.message : "Failed to save rubric"
        )
    }
}

/**
 * Delete rubric for a patient actor
 */
export async function deleteRubric(patientActorId: string) {
    try {
        const user = await requireAuth()

        // Verify ownership of patient actor
        const patientActor = await prisma.patientActor.findUnique({
            where: { id: patientActorId }
        })

        if (!patientActor) {
            throw new Error("Patient actor not found")
        }

        if (patientActor.ownerId !== user.id) {
            throw new Error("Unauthorized: You don't own this patient actor")
        }

        // Delete the rubric if it exists
        await prisma.gradingRubric.deleteMany({
            where: { patientActorId }
        })

        return { success: true }
    } catch (error) {
        console.error("Error deleting rubric:", error)
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete rubric"
        )
    }
}
