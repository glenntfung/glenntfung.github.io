import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

export function getMarkdownContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
        return '';
    }
}

export function getTomlContent<T>(filename: string): T | null {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent) as unknown as T;
    } catch (error) {
        console.error(`Error loading TOML file ${filename}:`, error);
        return null;
    }
}

export function getPageConfig<T = unknown>(pageName: string): T | null {
    return getTomlContent<T>(`${pageName}.toml`);
}

/**
 * TOML frontmatter fenced by `+++`, the format content/blog/*.md is authored in.
 *
 * Post metadata used to live in a sidecar content/blog-<slug>.toml next to the
 * body, which meant two files to create and keep in sync per post, plus a
 * `source` field pointing one at the other. One file, one slug.
 */
function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
    const match = /^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+[^\S\r\n]*\r?\n?/.exec(raw);
    if (!match) return { data: {}, body: raw };

    try {
        return { data: parse(match[1]) as Record<string, unknown>, body: raw.slice(match[0].length) };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        return { data: {}, body: raw.slice(match[0].length) };
    }
}

export interface BlogPostMeta {
    /** Route slug without the "blog-" prefix, e.g. "vmf". */
    slug: string;
    /** Full route path, e.g. "/blog-vmf". */
    href: string;
    title: string;
    summary: string;
    date: string;
    tags: string[];
    toc: 'none' | 'sections' | 'nested';
}

export interface BlogPost extends BlogPostMeta {
    /** Markdown body, frontmatter stripped. */
    body: string;
}

function asString(value: unknown): string {
    return typeof value === 'string' ? value : '';
}

function readPost(slug: string): BlogPost | null {
    let raw: string;
    try {
        raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf-8');
    } catch {
        return null;
    }

    const { data, body } = splitFrontmatter(raw);
    const title = asString(data.title);
    const date = asString(data.date);
    if (!title || !date) return null;

    const toc = data.toc;

    return {
        slug,
        href: `/blog-${slug}`,
        title,
        summary: asString(data.description),
        date,
        tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : [],
        toc: toc === 'nested' || toc === 'sections' ? toc : 'none',
        body,
    };
}

/**
 * Metadata for every post, newest first. Bodies are deliberately left out: this
 * feeds the /blog index, a client component, so anything returned here is
 * serialised into the page payload.
 */
export function getBlogPosts(): BlogPostMeta[] {
    return fs
        .readdirSync(BLOG_DIR)
        .filter(name => name.endsWith('.md'))
        .map(name => readPost(name.slice(0, -'.md'.length)))
        .filter((post): post is BlogPost => post !== null)
        .map(({ body, ...meta }) => { void body; return meta; })
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | null {
    // Slugs come from the route segment; keep them out of the path join.
    if (!/^[a-z0-9-]+$/i.test(slug)) return null;
    return readPost(slug);
}
