import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const prompts = {
    reformat: `Format the text in textbook style. Maintain coherence without changing the medium and the core meaning.`,
    'fix-typos': `Fix all spelling and grammar errors in the text. Maintain coherence without changing the medium and the core meaning.`,
    'remove-redundancy': `Remove redundant phrases and concepts from the text. Maintain coherence without changing the medium and the core meaning.`,
}

export async function POST(request: NextRequest) {
    try {
        const { text, action } = await request.json()

        if (!text || !action) {
            return NextResponse.json(
                { error: 'Missing text or action' },
                { status: 400 }
            )
        }

        if (!prompts[action as keyof typeof prompts]) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                {
                    role: 'system',
                    content: 'Behave like a intelligent editor of academic expert.',
                },
                {
                    role: 'user',
                    content: `${prompts[action as keyof typeof prompts]}\n\n${text}`,
                },
            ],
            temperature: 0.3,
        })

        const processedText = completion.choices[0]?.message?.content || text

        return NextResponse.json({ processedText })
    } catch (error) {
        console.error('AI processing error:', error)
        return NextResponse.json(
            { error: 'Failed to process text' },
            { status: 500 }
        )
    }
}
