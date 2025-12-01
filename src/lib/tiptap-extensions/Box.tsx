import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { BoxComponent } from './BoxComponent'

export interface BoxOptions {
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        box: {
            /**
             * Set a box node
             */
            setBox: () => ReturnType
            /**
             * Toggle a box node
             */
            toggleBox: () => ReturnType
        }
    }
}

export const Box = Node.create<BoxOptions>({
    name: 'box',

    group: 'block',

    content: 'block+',

    defining: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="box"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'box' }), 0]
    },

    addCommands() {
        return {
            setBox:
                () =>
                    ({ commands }) => {
                        return commands.wrapIn(this.name)
                    },
            toggleBox:
                () =>
                    ({ commands }) => {
                        return commands.toggleWrap(this.name)
                    },
        }
    },
})
