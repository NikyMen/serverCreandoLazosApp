import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '..', 'src', 'generated', 'prisma');
const dest = path.join(__dirname, '..', 'dist', 'generated', 'prisma');

function copyRecursive(source, target) {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
  } else {
    fs.copyFileSync(source, target);
  }
}

try {
  copyRecursive(src, dest);
  console.log(`Prisma client copied to: ${dest}`);
} catch (err) {
  console.error('Failed to copy Prisma client:', err);
  process.exitCode = 1;
}