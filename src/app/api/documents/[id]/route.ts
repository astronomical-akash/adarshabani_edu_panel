import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

// GET document by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const document = await prisma.document.findUnique({
            where: { id },
        })

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ document })
    } catch (error) {
        console.error('Error fetching document:', error)
        return NextResponse.json(
            { error: 'Failed to fetch document' },
            { status: 500 }
        )
    }
}

// PUT update document
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { title, content, settings } = await request.json()

        // Optionally update content in Vercel Blob
        let blobUrl = null
        if (process.env.BLOB_READ_WRITE_TOKEN && content) {
            try {
                const blob = await put(
                    `documents/${Date.now()}-${(title || 'document').replace(/[^a-zA-Z0-9]/g, '-')}.json`,
                    JSON.stringify(content),
                    { access: 'public' }
                )
                blobUrl = blob.url
            } catch (blobError) {
                console.error('Blob storage error:', blobError)
                // Continue without blob storage
            }
        }

        const document = await prisma.document.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(settings && { settings }),
                ...(blobUrl && { blobUrl }),
            },
        })

        return NextResponse.json({ document })
    } catch (error) {
        console.error('Error updating document:', error)
        return NextResponse.json(
            { error: 'Failed to update document' },
            { status: 500 }
        )
    }
}

// DELETE document
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await prisma.document.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting document:', error)
        return NextResponse.json(
            { error: 'Failed to delete document' },
            { status: 500 }
        )
    }
}
