import { notFound } from "next/navigation"
import { getPatientActorBySlug } from "@/lib/actions/patient-actors"
import PublicChatClient from "./page-client"

export default async function PublicChatPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const patientActor = await getPatientActorBySlug(slug)

    if (!patientActor) {
        notFound()
    }

    return <PublicChatClient patientActor={patientActor} />
}

