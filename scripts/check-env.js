const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',


const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`  - ${envVar}`);
  });
  console.error('\nPlease set these variables in your Vercel project settings or .env file.');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ All required environment variables are present.');
