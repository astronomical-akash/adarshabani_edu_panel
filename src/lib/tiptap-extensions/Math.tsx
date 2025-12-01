import { Node } from '@tiptap/core'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import MathComponent from './MathComponent'

export interface MathOptions {
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        math: {
            /**
             * Set a math block
             */
            setMath: (latex: string) => ReturnType
        }
    }
}

export const Math = Node.create<MathOptions>({
    name: 'math',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            latex: {
                default: '',
                parseHTML: element => element.getAttribute('data-latex'),
                renderHTML: attributes => {
                    return {
                        'data-latex': attributes.latex,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="math"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'math',
                class: 'math-block'
            }),
            ['span', { class: 'math-content' }, HTMLAttributes.latex || ''],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathComponent)
    },

    addCommands() {
        return {
            setMath:
                (latex: string) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: { latex },
                        })
                    },
        }
    },
})
