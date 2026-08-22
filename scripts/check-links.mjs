#!/usr/bin/env node
/**
 * Verifies every internal link and asset reference in the exported site
 * resolves to a real file in out/.
 *
 * Exists because two dead references reached production unnoticed: a next/link
 * pointing at a PDF (which the router swallowed) and three search-engine
 * verification files left in the repo root, outside public/, so they 404'd.
 *
 * No dependencies and no network: it walks out/ and resolves hrefs the way
 * GitHub Pages does, including `trailingSlash: true` directory indexes.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, posix } from 'node:path';

const OUT = resolve(process.argv[2] ?? 'out');

if (!existsSync(OUT)) {
    console.error(`✗ ${OUT} does not exist — run \`npm run build\` first.`);
    process.exit(1);
}

/** Every file under out/, as site-absolute URL paths. */
function walk(dir, base = '') {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const abs = join(dir, entry.name);
        const rel = posix.join(base, entry.name);
        if (entry.isDirectory()) files.push(...walk(abs, rel));
        else files.push(rel);
    }
    return files;
}

const allFiles = new Set(walk(OUT).map(f => `/${f}`));
const htmlFiles = [...allFiles].filter(f => f.endsWith('.html'));

/** Resolve a site path the way a static host would. */
function resolves(urlPath) {
    if (allFiles.has(urlPath)) return true;
    // trailingSlash: true -> /blog/ is served by /blog/index.html
    if (urlPath.endsWith('/') && allFiles.has(`${urlPath}index.html`)) return true;
    if (allFiles.has(`${urlPath}/index.html`)) return true;
    if (allFiles.has(`${urlPath}.html`)) return true;
    return false;
}

const ATTR = /(?:href|src)="([^"]+)"/g;
const broken = [];
let checked = 0;

for (const page of htmlFiles) {
    const html = readFileSync(join(OUT, page.slice(1)), 'utf8');
    const seen = new Set();

    for (const [, raw] of html.matchAll(ATTR)) {
        const value = raw.replace(/&amp;/g, '&');
        // Skip other origins, protocol-relative URLs, and non-navigational schemes.
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;
        if (value.startsWith('#') || value === '') continue;

        const path = value.split(/[?#]/)[0];
        if (!path) continue;

        // Relative paths resolve against the page's directory.
        const target = path.startsWith('/')
            ? path
            : posix.resolve(posix.dirname(page), path);

        if (seen.has(target)) continue;
        seen.add(target);
        checked++;

        if (!resolves(decodeURIComponent(target))) broken.push({ page, value, target });
    }
}

/**
 * Files nothing links to, but that must still ship. Search engines fetch the
 * verification files by exact URL; they lived in the repo root for months,
 * outside public/, and 404'd in production without anything noticing.
 */
const REQUIRED = [
    '/sitemap.xml',
    '/robots.txt',
    '/feed.xml',
    '/og.jpg',
    '/.nojekyll',                                  // stops Pages running Jekyll over _next/
    '/BingSiteAuth.xml',                           // Bing Webmaster Tools
    '/google1d249dbddbd77f34.html',                // Google Search Console
    '/744b0e2dd2d149789ab4d864d369b3d4.txt',       // IndexNow
];

const missing = REQUIRED.filter(f => !allFiles.has(f));

if (broken.length || missing.length) {
    if (broken.length) {
        console.error(`✗ ${broken.length} broken internal reference(s):\n`);
        for (const { page, value, target } of broken) {
            console.error(`  ${page}\n    -> ${value}   (resolved: ${target})`);
        }
    }
    if (missing.length) {
        console.error(`\n✗ ${missing.length} required file(s) missing from the export:\n`);
        for (const file of missing) console.error(`  ${file}`);
        console.error('\n  Files only ship if they live in public/ — the repo root is not copied.');
    }
    process.exit(1);
}

console.log(
    `✓ ${checked} internal references across ${htmlFiles.length} pages all resolve, ` +
    `and all ${REQUIRED.length} required files are present.`
);
