'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Editor } from '@/components/text-editor/Editor'
import { SettingsPanel, FormattingSettings, defaultSettings } from '@/components/text-editor/SettingsPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Download, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { generatePDF } from '@/lib/pdf-generator'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function EditorPage() {
    const params = useParams()
    const router = useRouter()
    const documentId = params?.id as string
    const editorRef = useRef<HTMLDivElement>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState<any>(null)
    const [settings, setSettings] = useState<FormattingSettings>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [exporting, setExporting] = useState(false)

    // Metadata state
    const [saveDialogOpen, setSaveDialogOpen] = useState(false)
    const [metadata, setMetadata] = useState({
        class: '',
        subject: '',
        chapter: '',
        topic: '',
        subtopic: '',
    })

    useEffect(() => {
        if (documentId && documentId !== 'new') {
            loadDocument()
        } else {
            setLoading(false)
            setTitle('Untitled Document')
        }
    }, [documentId])

    const loadDocument = async () => {
        try {
            const response = await fetch(`/api/documents/${documentId}`)
            if (response.ok) {
                const { document } = await response.json()
                setTitle(document.title)
                setContent(document.content)
                setSettings(document.settings || defaultSettings)
                if (document.metadata) {
                    setMetadata(document.metadata)
                }
            } else {
                toast.error('Failed to load document')
                router.push('/dashboard/editor')
            }
        } catch (error) {
            console.error('Error loading document:', error)
            toast.error('Failed to load document')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveClick = () => {
        setSaveDialogOpen(true)
    }

    const confirmSave = async () => {
        setSaving(true)
        setSaveDialogOpen(false)
        try {
            const isNew = !documentId || documentId === 'new'
            const url = isNew ? '/api/documents' : `/api/documents/${documentId}`
            const method = isNew ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    settings,
                    metadata // Save metadata
                }),
            })

            if (response.ok) {
                const { document } = await response.json()
                toast.success('Document saved successfully')

                if (isNew) {
                    router.push(`/dashboard/editor/${document.id}`)
                }
            } else {
                toast.error('Failed to save document')
            }
        } catch (error) {
            console.error('Error saving document:', error)
            toast.error('Failed to save document')
        } finally {
            setSaving(false)
        }
    }

    const handleAutoSave = async (newContent: any) => {
        setContent(newContent)

        // Auto-save only if document exists
        if (documentId && documentId !== 'new') {
            try {
                await fetch(`/api/documents/${documentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newContent }),
                })
            } catch (error) {
                console.error('Auto-save error:', error)
            }
        }
    }

    const exportPDF = async () => {
        setExporting(true)
        try {
            // Get the editor content element
            // We need to find the .tiptap element inside the wrapper
            const editorElement = editorRef.current?.querySelector('.tiptap') as HTMLElement

            if (!editorElement) {
                throw new Error('Editor element not found')
            }

            const pdfBlob = await generatePDF({
                title,
                element: editorElement,
            })

            // Download PDF
            const url = URL.createObjectURL(pdfBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success('PDF exported successfully')
        } catch (error) {
            console.error('PDF export error:', error)
            toast.error('Failed to export PDF')
        } finally {
            setExporting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/dashboard/editor')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document title"
                        className="max-w-md"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportPDF}
                        disabled={exporting}
                    >
                        {exporting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        Export PDF
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleSaveClick}
                        disabled={saving}
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden bg-gray-50">
                <div className="max-w-5xl mx-auto h-full py-8" ref={editorRef}>
                    <Editor
                        content={content}
                        onChange={setContent}
                        onSave={handleAutoSave}
                        settings={settings}
                    />
                </div>
            </div>

            {/* Settings Panel */}
            <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
            />

            {/* Save Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Save Document</DialogTitle>
                        <DialogDescription>
                            Please provide details for this document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="class">Class</Label>
                                <Input
                                    id="class"
                                    value={metadata.class}
                                    onChange={(e) => setMetadata({ ...metadata, class: e.target.value })}
                                    placeholder="e.g. 10"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={metadata.subject}
                                    onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                    placeholder="e.g. Physics"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="chapter">Chapter</Label>
                            <Input
                                id="chapter"
                                value={metadata.chapter}
                                onChange={(e) => setMetadata({ ...metadata, chapter: e.target.value })}
                                placeholder="e.g. Electrostatics"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                value={metadata.topic}
                                onChange={(e) => setMetadata({ ...metadata, topic: e.target.value })}
                                placeholder="e.g. Electric Charge"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtopic">Subtopic</Label>
                            <Input
                                id="subtopic"
                                value={metadata.subtopic}
                                onChange={(e) => setMetadata({ ...metadata, subtopic: e.target.value })}
                                placeholder="e.g. Properties of Charge"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="docTitle">Document Title</Label>
                            <Input
                                id="docTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
