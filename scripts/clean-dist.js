#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targets = [
  path.join(process.cwd(), '.next'),
  path.join(process.cwd(), '.vercel', 'output'),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`🧹 Removed ${target}`);
    } catch (error) {
      console.warn(`⚠️  Failed to remove ${target}:`, error.message);
    }
  }
}
