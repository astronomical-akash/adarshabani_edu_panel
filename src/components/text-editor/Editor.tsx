'use client'

import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { useEffect, useState } from 'react'
import { Box, Math } from '@/lib/tiptap-extensions'
import { EditorToolbar } from './EditorToolbar'
import './editor.css'
import 'katex/dist/katex.min.css'
import Image from '@tiptap/extension-image'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { Markdown } from 'tiptap-markdown'

interface EditorProps {
    content: any
    onChange: (content: any) => void
    onSave: (content: any) => void
    settings: any
}

export function Editor({ content, onChange, onSave, settings }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TextStyle,
            Color,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Box,
            Math,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            HorizontalRule,
            Markdown,
        ],
        content: content || {
            type: 'doc',
            content: [],
        },
        editorProps: {
            attributes: {
                class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none',
                style: 'font-family: "Tiro Bangla", serif;',
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            onChange(json)
        },
    })

    // Auto-save every 30 seconds
    useEffect(() => {
        if (!editor || !onSave) return

        const interval = setInterval(() => {
            const json = editor.getJSON()
            onSave(json)
        }, 30000)

        return () => clearInterval(interval)
    }, [editor, onSave])

    // Apply custom settings when they change
    useEffect(() => {
        if (settings && editor) {
            // Settings will be applied via CSS classes
            // This is handled in the settings panel
        }
    }, [settings, editor])

    const [previewMode, setPreviewMode] = useState(false)

    if (!editor) {
        return null
    }

    return (
        <div className="editor-container">
            <EditorToolbar
                editor={editor}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
            />
            <div className={`editor-content ${previewMode ? 'preview-mode' : ''}`}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export type { TipTapEditor as EditorInstance }
