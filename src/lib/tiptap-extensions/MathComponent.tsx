import { NodeViewWrapper } from '@tiptap/react'
import katex from 'katex'
import { useEffect, useRef } from 'react'

export default function MathComponent({ node }: { node: any }) {
    const latex = node.attrs.latex
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current && latex) {
            try {
                katex.render(latex, ref.current, {
                    throwOnError: false,
                    displayMode: true,
                })
            } catch (error) {
                console.error('KaTeX render error:', error)
                ref.current.textContent = latex
            }
        }
    }, [latex])

    return (
        <NodeViewWrapper className="math-block">
            <div ref={ref} className="math-content" contentEditable={false} />
        </NodeViewWrapper>
    )
}
