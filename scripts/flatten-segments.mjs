// Next 16's static export writes prefetch segments as nested folders (out/blog/__next.blog/__PAGE__.txt)
// while the client requests a flat, dot-joined name (out/blog/__next.blog.__PAGE__.txt).
// Static hosts like GitHub Pages can't rewrite, so copy every nested segment to its flat name.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('out');
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('__next.')) flatten(full, dir, entry.name);
    else walk(full);
  }
}

function flatten(segmentDir, parent, prefix) {
  for (const entry of fs.readdirSync(segmentDir, { withFileTypes: true })) {
    const full = path.join(segmentDir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(full, parent, name);
    else {
      fs.copyFileSync(full, path.join(parent, name));
      copied += 1;
    }
  }
}

if (fs.existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-segments: wrote ${copied} prefetch files`);
}
