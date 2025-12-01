'use client'

import { Editor } from '@tiptap/react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DotLoader } from '@/components/ui/dot-loader'

interface AIMenuProps {
    editor: Editor
}

const loaderFrames = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
]

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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        title="AI Features"
                        className="group relative overflow-hidden hover:bg-transparent"
                    >
                        <Sparkles className="h-4 w-4 text-black transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:via-yellow-500 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:animate-pulse" />
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

            <Dialog open={loading} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center py-10 gap-4 [&>button]:hidden">
                    <DotLoader
                        frames={loaderFrames}
                        className="gap-1"
                        dotClassName="bg-neutral-200 [&.active]:bg-black size-2"
                    />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        AI is processing your text...
                    </p>
                </DialogContent>
            </Dialog>
        </>
    )
}
