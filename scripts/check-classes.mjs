// Fails when a class is used in the HTML but never styled, or styled but never used.
// Catches typos and case mismatches like "Product-box-container" vs ".product-box-container".
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("style.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

const htmlClasses = new Set(
  [...html.matchAll(/\bclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/).filter(Boolean))
);
const cssClasses = new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));

const unstyled = [...htmlClasses].filter((c) => !cssClasses.has(c));
const unused = [...cssClasses].filter((c) => !htmlClasses.has(c));

for (const c of unstyled) console.error(`index.html uses class "${c}" but style.css has no ".${c}" rule`);
for (const c of unused) console.error(`style.css styles ".${c}" but index.html never uses it`);

if (unstyled.length || unused.length) process.exit(1);
console.log(`Classes match: ${htmlClasses.size} used in index.html, all styled in style.css.`);
