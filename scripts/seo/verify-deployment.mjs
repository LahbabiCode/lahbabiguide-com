#!/usr/bin/env node
/**
 * SEO Deployment Verifier for LahbabiGuide
 *
 * Run this AFTER every deployment to confirm the live site is serving the
 * Next.js app (not the old BadilHost Astro site) and that all SEO-critical
 * signals are correct.
 *
 * Usage:
 *   node scripts/seo/verify-deployment.mjs
 *   node scripts/seo/verify-deployment.mjs --url https://staging.example.com
 *
 * Exit code 0 = all critical checks passed. Non-zero = at least one failure.
 */

const DEFAULT_URL = process.env.SITE_URL || "https://lahbabiguide.com";
const siteUrl = process.argv.includes("--url")
  ? process.argv[process.argv.indexOf("--url") + 1]
  : DEFAULT_URL;

const WWW_URL = siteUrl.replace("://", "://www.");

let failures = 0;
let warnings = 0;

async function fetchText(url, { redirect = "follow" } = {}) {
  try {
    const res = await fetch(url, {
      redirect,
      headers: { "User-Agent": "LahbabiGuide-SEO-Verifier/1.0" },
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, finalUrl: res.url, headers: res.headers };
  } catch (err) {
    return { ok: false, status: 0, text: "", error: err.message };
  }
}

function pass(label) {
  console.log(`  \x1b[32m✓ PASS\x1b[0m  ${label}`);
}

function fail(label, detail) {
  failures++;
  console.log(`  \x1b[31m✗ FAIL\x1b[0m  ${label}`);
  if (detail) console.log(`          ${detail}`);
}

function warn(label, detail) {
  warnings++;
  console.log(`  \x1b[33m! WARN\x1b[0m  ${label}`);
  if (detail) console.log(`          ${detail}`);
}

async function checkRedirectCode() {
  console.log("\n[1/6] Redirect chain (apex vs www)");
  const res = await fetch(WWW_URL, { redirect: "manual" });
  if (res.status === 0) {
    fail("www variant unreachable", "Could not connect to www variant — DNS or SSL issue.");
    return;
  }
  // We expect www to redirect (301/308) toward apex, OR to be served as apex directly.
  const loc = res.headers.get("location") || "";
  if (res.status >= 300 && res.status < 400) {
    if (res.status === 301 || res.status === 308) {
      pass(`www → ${res.status} permanent redirect`);
    } else {
      fail(
        `www uses ${res.status} (temporary) redirect`,
        `Expected 301/308 for SEO. Location: ${loc}. Fix at the proxy/Cloudflare level.`
      );
    }
  } else {
    warn(
      "www served directly (no redirect)",
      "Acceptable if you intentionally serve both, but pick one canonical to avoid duplicate-content issues."
    );
  }
}

async function checkFramework() {
  console.log("\n[2/6] Framework served (must be Next.js, NOT Astro/BadilHost)");
  const { text, status } = await fetchText(siteUrl);
  if (status === 0 || !text) {
    fail("Homepage unreachable", "Could not fetch the homepage.");
    return { html: "" };
  }

  const astroCount = (text.match(/data-astro/g) || []).length;
  const nextCount = (text.match(/_next\//g) || []).length;
  const hasBadilhost = /badilhost/i.test(text);

  if (astroCount > 0) {
    fail(
      `Serving an Astro site (${astroCount} data-astro markers)`,
      "The live domain still serves the old BadilHost Astro build. DNS still points to Vercel, or the domain is still attached to the Vercel project. See docs/INFRA_FIX_GUIDE.md."
    );
  } else {
    pass("No Astro markers found");
  }

  if (hasBadilhost) {
    fail(
      "Found 'badilhost' references in the HTML",
      "The wrong site is live. Re-check DNS and Vercel project domain attachments."
    );
  } else {
    pass("No 'badilhost' references found");
  }

  if (nextCount > 0) {
    pass(`Next.js detected (${nextCount} _next/ references)`);
  } else {
    fail("No Next.js _next/ references found", "Expected for a Next.js production build.");
  }
  return { html: text };
}

function checkCanonical(html) {
  console.log("\n[3/6] Canonical & og:url");
  if (!html) {
    fail("Skipped (no HTML)");
    return;
  }
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    fail("Missing canonical link tag");
  } else {
    const canonical = canonicalMatch[1];
    if (/badilhost/i.test(canonical)) {
      fail(`Canonical points to badilhost: ${canonical}`);
    } else if (canonical.replace(/\/$/, "") !== siteUrl.replace(/\/$/, "")) {
      fail(`Canonical mismatch: got ${canonical}, expected ${siteUrl}`);
    } else {
      pass(`Canonical correct: ${canonical}`);
    }
  }

  const ogUrlMatch = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
  if (!ogUrlMatch) {
    warn("Missing og:url meta tag");
  } else {
    const ogUrl = ogUrlMatch[1];
    if (/badilhost/i.test(ogUrl)) {
      fail(`og:url points to badilhost: ${ogUrl}`);
    } else if (ogUrl.replace(/\/$/, "") !== siteUrl.replace(/\/$/, "")) {
      warn(`og:url mismatch: got ${ogUrl}, expected ${siteUrl}`);
    } else {
      pass(`og:url correct: ${ogUrl}`);
    }
  }
}

function checkTitleAndMeta(html) {
  console.log("\n[4/6] Title & meta description");
  if (!html) {
    fail("Skipped (no HTML)");
    return;
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) {
    fail("Missing <title> tag");
  } else {
    const title = titleMatch[1].trim();
    if (title.length < 10 || /search icon|close icon/i.test(title)) {
      fail(`Broken/placeholder title: "${title}"`, "This indicates the wrong site is live.");
    } else {
      pass(`Title OK: "${title.slice(0, 60)}${title.length > 60 ? "…" : ""}"`);
    }
  }

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (!descMatch) {
    warn("Missing meta description on homepage");
  } else {
    pass(`Meta description present (${descMatch[1].length} chars)`);
  }

  const jsonLdCount = (html.match(/application\/ld\+json/g) || []).length;
  if (jsonLdCount >= 2) {
    pass(`JSON-LD structured data present (${jsonLdCount} blocks)`);
  } else {
    warn(`Only ${jsonLdCount} JSON-LD block(s) — expected Organization + WebSite at minimum`);
  }
}

async function checkSeoFiles() {
  console.log("\n[5/6] SEO files (ads.txt, robots.txt, sitemap.xml)");

  const ads = await fetchText(`${siteUrl}/ads.txt`);
  if (ads.ok && /pub-6564248523089374/.test(ads.text)) {
    pass("ads.txt present and contains publisher ID");
  } else {
    fail("ads.txt missing or wrong publisher ID", `Status ${ads.status}`);
  }

  const robots = await fetchText(`${siteUrl}/robots.txt`);
  if (robots.ok && /sitemap\.xml/i.test(robots.text) && !/disallow:\s*\//i.test(robots.text.replace(/disallow:\s*\/admin/i, ""))) {
    pass("robots.txt present with sitemap reference");
  } else if (robots.ok) {
    pass("robots.txt present");
  } else {
    fail("robots.txt unreachable", `Status ${robots.status}`);
  }

  const sitemap = await fetchText(`${siteUrl}/sitemap.xml`);
  const locCount = sitemap.ok ? (sitemap.text.match(/<loc>/g) || []).length : 0;
  if (locCount >= 30) {
    pass(`sitemap.xml healthy (${locCount} URLs)`);
  } else if (sitemap.ok) {
    warn(`sitemap.xml has only ${locCount} URLs — expected 50+`);
  } else {
    fail("sitemap.xml unreachable", `Status ${sitemap.status}`);
  }
}

async function checkHttps() {
  console.log("\n[6/6] HTTPS & security headers");
  const { status, headers } = await fetchText(siteUrl);
  if (status === 0) return;

  const hsts = headers.get("strict-transport-security");
  if (hsts) {
    pass("HSTS header present");
  } else {
    warn("No HSTS header", "Recommended for production security.");
  }

  // Check that plain HTTP redirects to HTTPS
  const httpUrl = siteUrl.replace(/^https:/, "http:");
  const httpRes = await fetch(httpUrl, { redirect: "manual" }).catch(() => null);
  if (httpRes && (httpRes.status === 301 || httpRes.status === 308)) {
    pass("HTTP → HTTPS redirect (permanent)");
  } else {
    warn("HTTP not redirected to HTTPS with 301", "Verify at the proxy level.");
  }
}

async function main() {
  console.log(`\x1b[1m\n  LahbabiGuide — SEO Deployment Verifier\n\x1b[0m`);
  console.log(`  Target: ${siteUrl}`);
  console.log(`  www:    ${WWW_URL}\n`);

  await checkRedirectCode();
  const { html } = await checkFramework();
  checkCanonical(html);
  checkTitleAndMeta(html);
  await checkSeoFiles();
  await checkHttps();

  console.log("\n" + "─".repeat(50));
  if (failures === 0) {
    console.log(`\x1b[32m  ✓ ALL CRITICAL CHECKS PASSED\x1b[0m`);
    if (warnings > 0) console.log(`\x1b[33m  (${warnings} warning(s) — review above)\x1b[0m`);
    console.log("  Proceed to Google Search Console (docs/POST_LAUNCH_INDEXING.md).\n");
    process.exit(0);
  } else {
    console.log(`\x1b[31m  ✗ ${failures} CRITICAL FAILURE(S)\x1b[0m`);
    if (warnings > 0) console.log(`\x1b[33m  (${warnings} warning(s))\x1b[0m`);
    console.log("  Do NOT submit to Google Search Console until failures are resolved.");
    console.log("  See docs/INFRA_FIX_GUIDE.md for troubleshooting.\n");
    process.exit(1);
  }
}

main();
