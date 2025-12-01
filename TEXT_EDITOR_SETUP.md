# Text Editor Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env` file (or update existing) with:

```bash
# Get your OpenAI API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-your-key-here"

# Database credentials (automatically set by Vercel)
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."

# Blob storage (automatically set by Vercel)
BLOB_READ_WRITE_TOKEN="..."
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000/dashboard/editor`

## Features

- ✅ Rich text editing with TipTap
- ✅ Bengali font support (Tiro Bangla)
- ✅ LaTeX equations
- ✅ AI-powered text processing (reformat, fix typos, remove redundancies)
- ✅ PDF export with custom branding
- ✅ Auto-save functionality
- ✅ Customizable formatting settings

## Documentation

See [walkthrough.md](/Users/the.sky/.gemini/antigravity/brain/671cc761-0540-490c-842a-bf581a91bdfe/walkthrough.md) for complete documentation.

## Deployment

The project is ready to deploy to Vercel. Make sure to:
1. Add `OPENAI_API_KEY` to Vercel environment variables
2. Database and Blob storage will be auto-configured by Vercel
