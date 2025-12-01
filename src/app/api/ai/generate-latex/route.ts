import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/geminiService'

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json()

        if (!text) {
            return NextResponse.json(
                { error: 'Missing text' },
                { status: 400 }
            )
        }

        const latex = await geminiService.generateLatexFromText(text)
        return NextResponse.json({ latex })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate LaTeX' },
            { status: 500 }
        )
    }
}
