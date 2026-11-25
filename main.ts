// news-image-20261125 entrypoint.
// Copies the pre-built front page image to the harness output directory.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const srcPath = new URL('./entry.png', import.meta.url);
const dstPath = join(outDir, 'entry.png');

// Refuse to run on a missing source: a silent empty output would
// score zero instead of failing loudly here.
if (!existsSync(srcPath)) {
  throw new Error('entry.png missing beside main.ts');
}
const srcSize = statSync(srcPath).size;
if (srcSize === 0) {
  throw new Error('entry.png is empty, refusing to copy');
}
mkdirSync(outDir, { recursive: true });
copyFileSync(srcPath, dstPath);
// Verify the copy landed whole: the judge reads this file verbatim,
// so a truncated write must fail here, not score zero silently.
const dstSize = statSync(dstPath).size;
if (dstSize !== srcSize) {
  throw new Error(`copy size mismatch: ${dstSize} !== ${srcSize}`);
}
