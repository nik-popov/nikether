#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(process.cwd(), '.vercel', 'output', 'static');
const ASSETS_IGNORE = path.join(OUTPUT_DIR, '.assetsignore');
const WORKER_DIR = path.join(OUTPUT_DIR, '_worker.js');

try {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.warn(`⚠️  Cloudflare post-build skipped: ${OUTPUT_DIR} not found.`);
    process.exit(0);
  }

  const contents = '_worker.js\n';
  fs.writeFileSync(ASSETS_IGNORE, contents, { encoding: 'utf8' });

  if (fs.existsSync(WORKER_DIR)) {
    console.log('✅ Created .assetsignore to exclude _worker.js from static assets.');
  } else {
    console.log('ℹ️  _worker.js directory not found; wrote .assetsignore anyway.');
  }
} catch (error) {
  console.error('❌ Failed to prepare Cloudflare assets:', error);
  process.exit(1);
}
