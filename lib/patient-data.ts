import type { Patient } from "./types"

export const patientData: Patient = {
  id: "PT-2023-0055",
  demographics: "55-year-old male",
  chiefComplaint: "slowing down and resting tremor in both hands",
  medicalHistory: [
    "Hypertension (diagnosed 5 years ago)",
    "Sleep issues (REM sleep behavior disorder)",
    "Parkinsonian symptoms (onset 1 year ago)",
  ],
  medications: ["Amlodipine 5 mg daily", "Melatonin 3 mg at bedtime"],
  personality: "Soft-spoken, slightly withdrawn, occasionally frustrated by symptoms",
  socialHistory: "Lives with spouse, retired school teacher, previously active in community",
  neurologicalFindings: [
    "Bradykinesia (slowness of movement)",
    "Cogwheel rigidity in upper extremities",
    "Reduced arm swing while walking",
    "Resting tremor in both hands (right > left)",
  ],
  nonMotorSymptoms: [
    "REM sleep behavior disorder (acting out dreams)",
    "Constipation (3 years duration)",
    "Anosmia (loss of smell, 2 years duration)",
  ],
}
