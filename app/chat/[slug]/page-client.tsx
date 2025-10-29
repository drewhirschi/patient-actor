"use client"

import ChatInterface from "@/components/chat-interface"
import type { PatientActor } from "@/lib/generated/client"

interface PublicChatClientProps {
    patientActor: PatientActor
}

export default function PublicChatClient({ patientActor }: PublicChatClientProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Actor Simulation</h1>
                    <p className="text-sm text-gray-600">
                        Training simulation with {patientActor.name}
                    </p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full">
                    <ChatInterface
                        patientId={patientActor.id}
                        patientName={patientActor.name}
                        isPublic={true}
                    />
                </div>
            </main>
        </div>
    )
}

