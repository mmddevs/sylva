// Liste (ou corrige avec --write) les classes Tailwind non canoniques de src/,
// celles que l'extension VS Code signale en jaune (z-[70] → z-70, max-w-[34rem] → max-w-136…).
// Usage : node scripts/canonical-classes.mjs [--write]
// Utilise @tailwindcss/node (dépendance de Tailwind, déjà dans node_modules).
import fs from "node:fs";
import path from "node:path";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

const root = process.cwd();
const cssPath = path.join(root, "src/app/globals.css");
const ds = await __unstable__loadDesignSystem(fs.readFileSync(cssPath, "utf8"), { base: path.dirname(cssPath) });
const write = process.argv.includes("--write");

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : /\.(tsx?|css)$/.test(e.name) ? [path.join(d, e.name)] : []);
}
const files = walk(path.join(root, "src"));
const cache = new Map();
const canon = (tok) => {
  if (!cache.has(tok)) {
    let out = tok;
    try { out = ds.canonicalizeCandidates([tok], { rem: 16 })[0] ?? tok; } catch {}
    cache.set(tok, out);
  }
  return cache.get(tok);
};

let total = 0;
for (const f of files) {
  if (f.endsWith(".css")) continue;
  let src = fs.readFileSync(f, "utf8");
  let changed = false;
  const next = src.replace(/[^\s"'`<>{}]+/g, (tok, off) => {
    if (!/[\[\]()!]|\/|^-/.test(tok) && !/-\d/.test(tok)) return tok;
    const c = canon(tok);
    if (c !== tok) {
      const line = src.slice(0, off).split("\n").length;
      console.log(`${path.relative(root, f)}:${line}  ${tok}  ->  ${c}`);
      total++; changed = true;
      return c;
    }
    return tok;
  });
  if (write && changed) fs.writeFileSync(f, next);
}
console.log(`\n${total} suggestion(s)`);
