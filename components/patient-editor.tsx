"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Save, Loader2, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePatientActor } from "@/lib/actions/patient-actors"
import type { PatientActor } from "@/lib/generated/client"
import 'react-markdown-editor-lite/lib/index.css'

// Dynamically import the markdown editor to avoid SSR issues
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

// Import markdown-it for rendering
import MarkdownIt from 'markdown-it'

const mdParser = new MarkdownIt()

interface PatientEditorProps {
    patient: PatientActor
    onUpdate?: (patient: PatientActor) => void
}

export default function PatientEditor({ patient, onUpdate }: PatientEditorProps) {
    const [name, setName] = useState(patient.name)
    const [age, setAge] = useState(patient.age.toString())
    const [prompt, setPrompt] = useState(patient.prompt)
    const [isPublic, setIsPublic] = useState(patient.isPublic)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [copiedUrl, setCopiedUrl] = useState(false)

    // Debug: Log patient data
    useEffect(() => {
        console.log('PatientEditor mounted/updated with patient:', {
            id: patient.id,
            name: patient.name,
            slug: patient.slug,
            hasSlug: !!patient.slug,
            fullPatient: patient
        })
    }, [patient])

    const getShareableUrl = () => {
        if (typeof window === 'undefined') {
            console.warn('Cannot create URL: window is undefined (SSR)')
            return ""
        }

        if (!patient.slug) {
            console.warn('Cannot create URL: patient.slug is missing', {
                patientId: patient.id,
                patientName: patient.name,
                slug: patient.slug,
                hasSlugField: 'slug' in patient
            })
            return ""
        }

        const url = `${window.location.origin}/chat/${patient.slug}`
        console.log('Shareable URL generated:', url, { slug: patient.slug })
        return url
    }

    const copyShareableUrl = async () => {
        const url = getShareableUrl()
        if (!url) {
            console.error('No URL available to copy')
            return
        }
        try {
            await navigator.clipboard.writeText(url)
            setCopiedUrl(true)
            setTimeout(() => setCopiedUrl(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const openInNewTab = () => {
        const url = getShareableUrl()
        if (!url) {
            console.error('No URL available to open')
            return
        }
        window.open(url, '_blank')
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveStatus('idle')

        try {
            await updatePatientActor(patient.id, {
                name,
                age: parseInt(age),
                prompt,
            })

            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 2000)

            if (onUpdate) {
                onUpdate({ ...patient, name, age: parseInt(age), prompt })
            }
        } catch (error) {
            console.error('Error saving patient:', error)
            setSaveStatus('error')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } finally {
            setIsSaving(false)
        }
    }

    const handleEditorChange = ({ text }: { text: string }) => {
        setPrompt(text)
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header with Shareable URL */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                            Edit Patient Actor
                        </h2>
                        <p className="text-sm text-gray-600">Shareable URL for testing:</p>
                        <div className="flex items-center gap-2 mt-2">
                            <code className="text-sm bg-white px-3 py-2 rounded border border-blue-200 truncate flex-1 font-mono">
                                {getShareableUrl()}
                            </code>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={copyShareableUrl}
                                className="flex-shrink-0"
                            >
                                {copiedUrl ? (
                                    <>
                                        <Check className="h-4 w-4 mr-1" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-1" />
                                        Copy
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                onClick={openInNewTab}
                                className="flex-shrink-0"
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Test
                            </Button>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={
                            saveStatus === 'success'
                                ? 'bg-green-600 hover:bg-green-700'
                                : saveStatus === 'error'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : ''
                        }
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : saveStatus === 'success' ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Saved
                            </>
                        ) : saveStatus === 'error' ? (
                            'Error'
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Patient Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Philip Walters"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g., 55"
                            />
                        </div>
                    </div>

                    {/* Markdown Editor for Prompt */}
                    <div className="space-y-2">
                        <Label>Patient Prompt (System Instructions)</Label>
                        <p className="text-sm text-gray-600 mb-2">
                            Use markdown to format your patient actor's instructions and behavior
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                            <MdEditor
                                value={prompt}
                                style={{ height: '500px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={handleEditorChange}
                                placeholder="Enter patient actor instructions and behavior here..."
                                view={{ menu: true, md: true, html: false }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

