# How to Find Your Environment Variables

Here is a step-by-step guide to finding the required variables for your Vercel Postgres setup.

## 1. Database Variables (Vercel Postgres)
**These are automatically handled by Vercel!**

When you create a Vercel Postgres database and link it to your project, Vercel automatically adds the following environment variables to your deployment:
*   `POSTGRES_URL`
*   `POSTGRES_PRISMA_URL`
*   `POSTGRES_URL_NON_POOLING`
*   ...and others.

**You do NOT need to manually find these for deployment.**

### For Local Development (Optional)
If you want to run the app locally with the Vercel database:
1.  Install Vercel CLI: `npm i -g vercel`
2.  Link your project: `vercel link`
3.  Pull environment variables: `vercel env pull .env`

---



## 3. Vercel Variable
### `NEXT_PUBLIC_BASE_URL`
*   This is simply the URL where your app will live.
*   If you haven't deployed yet, you can use `http://localhost:3000` for now, or guess your Vercel URL (usually `https://[project-name].vercel.app`).
*   Once you deploy, Vercel will give you a domain. You can come back and update this variable later.

## 4. Vercel Blob (File Storage)
**Required for:** Storing uploaded files (videos, PDFs, images).

*   **BLOB_READ_WRITE_TOKEN**:
    *   Go to Vercel Dashboard -> Storage -> Create Database -> **Blob**.
    *   Once created, go to **Settings** -> **Environment Variables**.
    *   You will see `BLOB_READ_WRITE_TOKEN` automatically added.

