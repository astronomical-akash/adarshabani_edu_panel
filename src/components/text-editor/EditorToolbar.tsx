'use client'

import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Box as BoxIcon,
    Sigma,
    Undo,
    Redo,
    Minus,
    Image as ImageIcon,
    Eye,
    Sparkles,
    Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIMenu } from './AIMenu'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface EditorToolbarProps {
    editor: Editor | null
    previewMode: boolean
    setPreviewMode: (mode: boolean) => void
}

export function EditorToolbar({ editor, previewMode, setPreviewMode }: EditorToolbarProps) {
    const [latexDialogOpen, setLatexDialogOpen] = useState(false)
    const [latexInput, setLatexInput] = useState('')
    const [generatingLatex, setGeneratingLatex] = useState(false)
    const [formattingDoc, setFormattingDoc] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiDialogOpen, setAiDialogOpen] = useState(false)

    if (!editor) {
        return null
    }

    const insertLatex = () => {
        if (latexInput) {
            // Check if it's inline or block
            // For now, we insert as inline math node
            // The user can wrap in $$ for block if they want, or we can detect
            editor.chain().focus().insertContent(`<span data-type="math" data-latex="${latexInput}"></span>`).run()
            setLatexInput('')
            setLatexDialogOpen(false)
        }
    }

    const generateLatexFromAI = async () => {
        if (!aiPrompt) return

        setGeneratingLatex(true)
        try {
            const response = await fetch('/api/ai/generate-latex', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: aiPrompt }),
            })

            if (!response.ok) throw new Error('Failed to generate LaTeX')

            const { latex } = await response.json()
            setLatexInput(latex)
            setAiDialogOpen(false)
            setAiPrompt('')
            toast.success('LaTeX generated successfully')
        } catch (error) {
            console.error('AI Error:', error)
            toast.error('Failed to generate LaTeX')
        } finally {
            setGeneratingLatex(false)
        }
    }

    const autoFormatDocument = async () => {
        setFormattingDoc(true)
        try {
            const html = editor.getHTML()
            const response = await fetch('/api/ai/auto-format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: html }),
            })

            if (!response.ok) throw new Error('Failed to format document')

            const { formattedText } = await response.json()

            // We need to be careful replacing content
            editor.commands.setContent(formattedText)
            toast.success('Document formatted successfully')
        } catch (error) {
            console.error('AI Error:', error)
            toast.error('Failed to format document')
        } finally {
            setFormattingDoc(false)
        }
    }

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <>
            <div className="editor-toolbar bg-white border-b border-neutral-200">
                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <Bold className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <Italic className="h-4 w-4 text-black" />
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <Heading1 className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <Heading2 className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <Heading3 className="h-4 w-4 text-black" />
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <List className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                    >
                        <ListOrdered className="h-4 w-4 text-black" />
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleMark('box').run()}
                        className={editor.isActive('box') ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                        title="Insert Box"
                    >
                        <BoxIcon className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLatexDialogOpen(true)}
                        title="Insert LaTeX Equation"
                        className="hover:bg-neutral-50"
                    >
                        <Sigma className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Insert Divider"
                        className="hover:bg-neutral-50"
                    >
                        <Minus className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addImage}
                        title="Insert Image"
                        className="hover:bg-neutral-50"
                    >
                        <ImageIcon className="h-4 w-4 text-black" />
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={previewMode ? 'is-active bg-neutral-100' : 'hover:bg-neutral-50'}
                        title={previewMode ? "Edit Mode" : "Preview Mode"}
                    >
                        <Eye className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={autoFormatDocument}
                        disabled={formattingDoc}
                        className="hover:bg-neutral-50"
                        title="AI Auto-Format (Auto-LaTeX)"
                    >
                        {formattingDoc ? (
                            <Loader2 className="h-4 w-4 animate-spin text-black" />
                        ) : (
                            <Sparkles className="h-4 w-4 text-black" />
                        )}
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <div className="toolbar-group ml-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="hover:bg-neutral-50"
                    >
                        <Undo className="h-4 w-4 text-black" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="hover:bg-neutral-50"
                    >
                        <Redo className="h-4 w-4 text-black" />
                    </Button>
                </div>

                <div className="toolbar-divider bg-neutral-200" />

                <AIMenu editor={editor} />
            </div>

            {/* LaTeX Dialog */}
            <Dialog open={latexDialogOpen} onOpenChange={setLatexDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert LaTeX Equation</DialogTitle>
                        <DialogDescription>
                            Enter your LaTeX equation below or generate it with AI.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex gap-2">
                            <Input
                                id="latex"
                                placeholder="e.g. E = mc^2"
                                value={latexInput}
                                onChange={(e) => setLatexInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        insertLatex()
                                    }
                                }}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setAiDialogOpen(true)}
                                title="Generate with AI"
                            >
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={insertLatex}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Generation Dialog */}
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Equation with AI</DialogTitle>
                        <DialogDescription>
                            Describe the equation you want to generate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="e.g. quadratic formula"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    generateLatexFromAI()
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={generateLatexFromAI} disabled={generatingLatex}>
                            {generatingLatex ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
