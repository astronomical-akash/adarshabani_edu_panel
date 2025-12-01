'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Plus, FileText, Trash2, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Document {
    id: string
    title: string
    createdAt: string
    updatedAt: string
}

export default function EditorIndexPage() {
    const router = useRouter()
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadDocuments()
    }, [])

    const loadDocuments = async () => {
        try {
            const response = await fetch('/api/documents')
            if (response.ok) {
                const { documents } = await response.json()
                setDocuments(documents)
            }
        } catch (error) {
            console.error('Error loading documents:', error)
            toast.error('Failed to load documents')
        } finally {
            setLoading(false)
        }
    }

    const createNewDocument = () => {
        router.push('/dashboard/editor/new')
    }

    const deleteDocument = async (id: string) => {
        setDeleting(true)
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Document deleted')
                setDocuments(documents.filter((d) => d.id !== id))
            } else {
                toast.error('Failed to delete document')
            }
        } catch (error) {
            console.error('Error deleting document:', error)
            toast.error('Failed to delete document')
        } finally {
            setDeleting(false)
            setDeleteDialog(null)
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
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Text Editor</h1>
                    <p className="text-muted-foreground mt-2">
                        Create and manage documents with AI-powered features
                    </p>
                </div>
                <Button onClick={createNewDocument} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                </Button>
            </div>

            {documents.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first document to get started
                        </p>
                        <Button onClick={createNewDocument}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Document
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <Card
                            key={doc.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => router.push(`/dashboard/editor/${doc.id}`)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setDeleteDialog(doc.id)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <CardTitle className="mt-4">{doc.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-3 w-3" />
                                    Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog !== null}
                onOpenChange={(open) => !open && setDeleteDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this document? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteDialog && deleteDocument(deleteDialog)}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
