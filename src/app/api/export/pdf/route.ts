import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const { documentId } = await request.json()

        if (!documentId) {
            return NextResponse.json(
                { error: 'Document ID is required' },
                { status: 400 }
            )
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId },
        })

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        // Return document data for client-side PDF generation
        return NextResponse.json({
            title: document.title,
            content: document.content,
            settings: document.settings,
        })
    } catch (error) {
        console.error('Error fetching document for PDF:', error)
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        )
    }
}
