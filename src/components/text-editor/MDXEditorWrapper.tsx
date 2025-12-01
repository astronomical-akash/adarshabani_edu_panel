'use client'

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    imagePlugin,
    tablePlugin,
    linkPlugin,
    linkDialogPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    BlockTypeSelect,
    CodeToggle,
    CreateLink,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    Separator,
    MDXEditorMethods
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { forwardRef, useRef, useImperativeHandle } from 'react'
import { cn } from '@/lib/utils'

interface MDXEditorWrapperProps {
    markdown: string
    onChange?: (markdown: string) => void
    className?: string
    readOnly?: boolean
}

export const MDXEditorWrapper = forwardRef<MDXEditorMethods, MDXEditorWrapperProps>(({ markdown, onChange, className, readOnly }, ref) => {
    const editorRef = useRef<MDXEditorMethods>(null)

    useImperativeHandle(ref, () => editorRef.current!, [])

    return (
        <div className={cn("mdx-editor-wrapper", className)} style={{ fontFamily: 'var(--font-tiro-bangla), serif' }}>
            <MDXEditor
                ref={editorRef}
                markdown={markdown}
                onChange={onChange}
                readOnly={readOnly}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    imagePlugin({
                        imageUploadHandler: async (image: File) => {
                            const response = await fetch(`/api/upload?filename=${image.name}`, {
                                method: 'POST',
                                body: image,
                            })
                            const newBlob = await response.json()
                            return newBlob.url
                        }
                    }),
                    tablePlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <BlockTypeSelect />
                                <Separator />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <InsertTable />
                                <InsertThematicBreak />
                            </>
                        )
                    })
                ]}
                contentEditableClassName="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none text-gray-900 dark:text-gray-900"
            />
        </div>
    )
})

MDXEditorWrapper.displayName = 'MDXEditorWrapper'
