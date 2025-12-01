import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

// GET all documents
export async function GET() {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json({ documents })
    } catch (error) {
        console.error('Error fetching documents:', error)
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        )
    }
}

// POST create new document
export async function POST(request: NextRequest) {
    try {
        const { title, content, settings } = await request.json()

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        // Optionally store content in Vercel Blob
        let blobUrl = null
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const blob = await put(
                    `documents/${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.json`,
                    JSON.stringify(content),
                    { access: 'public' }
                )
                blobUrl = blob.url
            } catch (blobError) {
                console.error('Blob storage error:', blobError)
                // Continue without blob storage
            }
        }

        const document = await prisma.document.create({
            data: {
                title,
                content: content || {},
                settings: settings || null,
                blobUrl,
            },
        })

        return NextResponse.json({ document }, { status: 201 })
    } catch (error) {
        console.error('Error creating document:', error)
        return NextResponse.json(
            { error: 'Failed to create document' },
            { status: 500 }
        )
    }
}
