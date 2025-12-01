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

        const formattedText = await geminiService.autoFormatDocument(text)
        return NextResponse.json({ formattedText })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Failed to auto-format document' },
            { status: 500 }
        )
    }
}
