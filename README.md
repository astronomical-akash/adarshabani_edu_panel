This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/astronomical-akash/edu-admin-panel)

<!-- Last deployment trigger: 2025-11-29 14:42 -->

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is designed to be deployed on [Vercel](https://vercel.com).

### Prerequisites

You must set the following environment variables in your Vercel Project Settings:

- `POSTGRES_PRISMA_URL`: Connection string for your Postgres database (pooling).
- `POSTGRES_URL_NON_POOLING`: Connection string for your Postgres database (direct).
- `GOOGLE_CLIENT_EMAIL`: Service account email for Google Drive integration.
- `GOOGLE_PRIVATE_KEY`: Private key for Google Drive service account.
- `NEXT_PUBLIC_BASE_URL`: The URL of your deployed application (e.g., `https://your-app.vercel.app`).
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

See `.env.example` for more details.

### Steps

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the environment variables listed above.
4. Deploy!

The build will fail if these variables are not present, ensuring you don't deploy a broken app.
