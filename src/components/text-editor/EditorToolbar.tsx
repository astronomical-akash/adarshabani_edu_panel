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

interface EditorToolbarProps {
    editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const [latexDialogOpen, setLatexDialogOpen] = useState(false)
    const [latexInput, setLatexInput] = useState('')

    if (!editor) {
        return null
    }

    const insertLatex = () => {
        if (latexInput) {
            editor.chain().focus().insertContent(`<div data-type="math" data-latex="${latexInput}"></div>`).run()
            setLatexInput('')
            setLatexDialogOpen(false)
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

            <Dialog open={latexDialogOpen} onOpenChange={setLatexDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert LaTeX Equation</DialogTitle>
                        <DialogDescription>
                            Enter your LaTeX equation below. Example: E = mc^2
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="latex">Equation</Label>
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
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={insertLatex}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
