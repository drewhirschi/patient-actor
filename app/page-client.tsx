"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { Plus } from "lucide-react"
import PatientEditor from "@/components/patient-editor"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { createPatientActor } from "@/lib/actions/patient-actors"
import type { PatientActor } from "@/lib/generated/client"

interface HomeClientProps {
  patientActors: PatientActor[]
  userName: string | null
}

export default function HomeClient({ patientActors, userName }: HomeClientProps) {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<PatientActor | null>(
    patientActors[0] || null
  )
  const [patients, setPatients] = useState<PatientActor[]>(patientActors)
  const [isCreating, setIsCreating] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  const handlePatientUpdate = (updatedPatient: PatientActor) => {
    setPatients(prev =>
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    )
    if (selectedPatient?.id === updatedPatient.id) {
      setSelectedPatient(updatedPatient)
    }
  }

  const handlePatientDelete = () => {
    if (!selectedPatient) return

    // Remove the deleted patient from the list
    const updatedPatients = patients.filter(p => p.id !== selectedPatient.id)
    setPatients(updatedPatients)

    // Select the next patient, or null if no patients left
    setSelectedPatient(updatedPatients.length > 0 ? updatedPatients[0] : null)
  }

  const handleCreatePatient = async () => {
    setIsCreating(true)
    try {
      const newPatient = await createPatientActor({
        name: "New Patient Actor",
        age: 50,
        prompt: "# Patient Actor Instructions\n\nEnter your patient actor's behavior and characteristics here...",
      })

      setPatients(prev => [newPatient, ...prev])
      setSelectedPatient(newPatient)
    } catch (error) {
      console.error("Error creating patient:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Actor</h1>
            <p className="text-sm text-gray-600">Medical Diagnosis Training Simulation</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {userName && `Welcome, ${userName}`}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4">
        {patients.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">No patient actors yet</p>
              <p className="text-sm text-gray-600 mt-2 mb-4">
                Create your first patient actor to get started
              </p>
              <Button
                onClick={handleCreatePatient}
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "Create Patient Actor"}
              </Button>
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="rounded-lg border bg-white">
            {/* Sidebar */}
            <Panel defaultSize={25} minSize={20} maxSize={35}>
              <div className="h-full overflow-y-auto p-4 border-r flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-3">Patient Actors</h2>
                  <Button
                    onClick={handleCreatePatient}
                    disabled={isCreating}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isCreating ? "Creating..." : "Create New Patient"}
                  </Button>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedPatient?.id === patient.id
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">Age {patient.age}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

            {/* Editor Area */}
            <Panel defaultSize={75} minSize={65}>
              {selectedPatient ? (
                <PatientEditor
                  key={selectedPatient.id}
                  patient={selectedPatient}
                  onUpdate={handlePatientUpdate}
                  onDelete={handlePatientDelete}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">Select a patient to edit</p>
                    <p className="text-sm">Choose from the list on the left to start editing</p>
                  </div>
                </div>
              )}
            </Panel>
          </PanelGroup>
        )}
      </main>
    </div>
  )
}
