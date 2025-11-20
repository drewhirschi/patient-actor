import { requireAuthPage } from "@/lib/auth-utils"
import { getMyPatientActors } from "@/lib/actions/patient-actors"
import { getSubmittedSessions } from "@/lib/actions/sessions"
import prisma from "@/lib/prisma"
import HomeClient from "./page-client"

export default async function Home() {
  const authUser = await requireAuthPage()
  const patientActors = await getMyPatientActors()

  // Get full user from database to access role
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  const userRole = user?.role || "student"

  // Try to fetch submissions (only works for instructors)
  let submissions: any[] = []
  try {
    submissions = await getSubmittedSessions()
  } catch (error) {
    // User is not an instructor, that's okay
    console.log("User is not an instructor, skipping submissions fetch")
  }

  return (
    <HomeClient
      patientActors={patientActors}
      userName={authUser.name}
      userRole={userRole}
      submissions={submissions}
    />
  )
}
