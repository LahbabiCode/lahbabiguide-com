#!/usr/bin/env node
/**
 * One-shot migration: replace hardcoded "https://lahbabiguide.com" references
 * with the centralized SITE_URL import across the codebase.
 *
 * Patterns handled:
 *   1. `https://lahbabiguide.com/path/${var}`  -> `${SITE_URL}/path/${var}`
 *   2. "https://lahbabiguide.com/path"          -> `${SITE_URL}/path`
 *   3. "https://lahbabiguide.com"               -> SITE_URL
 *
 * Adds:  import { SITE_URL } from "@/lib/seo/site";  (if missing and replacements were made)
 *
 * Skips files that already import it. Safe to re-run (idempotent).
 *
 * Usage: node scripts/seo/migrate-domain-refs.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// Get list of files with hardcoded domain (excluding site.ts itself and build dirs).
const filesRaw = execSync(
  `grep -rl "https://lahbabiguide.com" app components lib 2>/dev/null | grep -v node_modules | grep -v ".next"`,
  { encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter(Boolean)
  // Skip the central config (it legitimately holds the fallback) and the migration script.
  .filter((f) => f !== "lib/seo/site.ts" && !f.includes("migrate-domain-refs"));

const IMPORT_LINE = `import { SITE_URL } from "@/lib/seo/site";`;
let totalReplacements = 0;
let touchedFiles = 0;

for (const file of filesRaw) {
  let src = readFileSync(file, "utf8");
  const before = src;

  // 1. Template literals: `https://lahbabiguide.com...` -> `${SITE_URL}...`
  src = src.replace(/`https:\/\/lahbabiguide\.com([^`]*)`/g, (_, rest) => {
    // rest may already start with / ; if empty, just SITE_URL
    return rest ? `\`\${SITE_URL}${rest}\`` : "SITE_URL";
  });

  // 2. Double-quoted full path: "https://lahbabiguide.com/path" -> `${SITE_URL}/path`
  src = src.replace(/"https:\/\/lahbabiguide\.com(\/[^\s"]*)"/g, (_, path) => {
    return "`${SITE_URL}" + path + "`";
  });

  // 3. Bare origin in double quotes: "https://lahbabiguide.com" -> SITE_URL
  src = src.replace(/"https:\/\/lahbabiguide\.com"/g, "SITE_URL");

  // 4. Bare origin in single quotes (rare): 'https://lahbabiguide.com' -> SITE_URL
  src = src.replace(/'https:\/\/lahbabiguide\.com'/g, "SITE_URL");

  if (src === before) continue; // nothing changed (already migrated in prior edit)

  // Add the import if we made substitutions and it's not present.
  if (!/from\s+"@\/lib\/seo\/site"/.test(src) && !/from\s+'@\/lib\/seo\/site'/.test(src)) {
    // Insert after the last import line. Fallback: prepend.
    const lines = src.split("\n");
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^import\s/.test(lines[i])) lastImportIdx = i;
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
      src = lines.join("\n");
    } else {
      src = `${IMPORT_LINE}\n${src}`;
    }
  }

  writeFileSync(file, src, "utf8");
  const delta = (before.match(/https:\/\/lahbabiguide\.com/g) || []).length;
  totalReplacements += delta;
  touchedFiles += 1;
  console.log(`  ✓ ${file}  (${delta} refs)`);
}

console.log(`\nDone. Touched ${touchedFiles} files, replaced ${totalReplacements} references.`);
console.log("Next: run `npm run build` to verify.");
