import type { Patient } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PatientProfileProps {
  patient: Patient
}

export default function PatientProfile({ patient }: PatientProfileProps) {
  return (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle className="flex items-center justify-between">
          <span>Patient Profile</span>
          <Badge variant="outline">{patient.id}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Demographics</h3>
            <p className="text-base">{patient.demographics}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Chief Complaint</h3>
            <p className="text-base">"{patient.chiefComplaint}"</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
            <ul className="list-disc pl-5 text-base">
              {patient.medicalHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Medications</h3>
            <ul className="list-disc pl-5 text-base">
              {patient.medications.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Social History</h3>
            <p className="text-base">{patient.socialHistory}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Personality</h3>
            <p className="text-base">{patient.personality}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
