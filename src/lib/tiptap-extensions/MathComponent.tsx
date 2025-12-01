import { NodeViewWrapper } from '@tiptap/react'
import katex from 'katex'
import { useEffect, useRef } from 'react'

export default function MathComponent({ node }: { node: any }) {
    const latex = node.attrs.latex
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (ref.current && latex) {
            try {
                katex.render(latex, ref.current, {
                    throwOnError: false,
                    displayMode: false, // Inline by default
                })
            } catch (error) {
                console.error('KaTeX render error:', error)
                ref.current.textContent = latex
            }
        }
    }, [latex])

    return (
        <NodeViewWrapper className="math-node inline-block mx-1">
            <span className="math-source font-mono text-xs bg-gray-100 px-1 rounded text-blue-600 border border-blue-200">
                ${latex}$
            </span>
            <span ref={ref} className="math-rendered" contentEditable={false} />
        </NodeViewWrapper>
    )
}
