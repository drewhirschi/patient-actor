import { requireAuthPage } from "@/lib/auth-utils"
import { getMyPatientActors } from "@/lib/actions/patient-actors"
import HomeClient from "./page-client"

export default async function Home() {
  const user = await requireAuthPage()
  const patientActors = await getMyPatientActors()

  return <HomeClient patientActors={patientActors} userName={user.name} />
}
