'use client'

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export const BoxComponent = (props: any) => {
    return (
        <NodeViewWrapper className="box">
            <div className="box-content">
                <NodeViewContent />
            </div>
        </NodeViewWrapper>
    )
}
