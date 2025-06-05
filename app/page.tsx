import PatientProfile from "@/components/patient-profile"
import ChatInterface from "@/components/chat-interface"
import ObjectivesPanel from "@/components/objectives-panel"
import { patientData } from "@/lib/patient-data"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Medical Education Simulation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientProfile patient={patientData} />
          <ObjectivesPanel className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
