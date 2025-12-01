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
    Sparkles,
    Undo,
    Redo,
    Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AIMenu } from './AIMenu'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EditorToolbarProps {
    editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const [latexDialogOpen, setLatexDialogOpen] = useState(false)
    const [latexInput, setLatexInput] = useState('')

    const insertLatex = () => {
        if (latexInput.trim()) {
            editor.commands.setMath(latexInput)
            setLatexInput('')
            setLatexDialogOpen(false)
        }
    }

    return (
        <>
            <div className="editor-toolbar">
                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBox().run()}
                        className={editor.isActive('box') ? 'is-active' : ''}
                        title="Box / Callout"
                    >
                        <BoxIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLatexDialogOpen(true)}
                        title="Insert LaTeX Equation"
                    >
                        <Sigma className="h-4 w-4" />
                    </Button>
                </div>

                <div className="toolbar-divider" />

                <AIMenu editor={editor} />
            </div>

            {/* LaTeX Dialog */}
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
                            <Label htmlFor="latex">LaTeX Expression</Label>
                            <Input
                                id="latex"
                                placeholder="E = mc^2"
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
                        <Button variant="outline" onClick={() => setLatexDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={insertLatex}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
