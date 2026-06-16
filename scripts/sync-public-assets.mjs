import { copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

copyFileSync(join(projectRoot, 'src', 'style.css'), join(projectRoot, 'public', 'style.css'));
console.log('Synced public/style.css');
