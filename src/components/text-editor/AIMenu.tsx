'use client'

import { Editor } from '@tiptap/react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { toast } from 'sonner'

interface AIMenuProps {
    editor: Editor
}

export function AIMenu({ editor }: AIMenuProps) {
    const [loading, setLoading] = useState(false)

    const processText = async (action: 'reformat' | 'fix-typos' | 'remove-redundancy') => {
        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, ' ')

        if (!selectedText.trim()) {
            toast.error('Please select some text first')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/ai/process-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: selectedText,
                    action,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to process text')
            }

            const { processedText } = await response.json()

            // Replace selected text with processed text
            editor
                .chain()
                .focus()
                .deleteRange({ from, to })
                .insertContent(processedText)
                .run()

            toast.success('Text processed successfully')
        } catch (error) {
            console.error('AI processing error:', error)
            toast.error('Failed to process text. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={loading} title="AI Features">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => processText('reformat')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Reformat Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => processText('fix-typos')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Fix Typos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => processText('remove-redundancy')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Remove Redundancies
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
