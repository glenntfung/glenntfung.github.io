import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getMarkdownContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
        return '';
    }
}

export function getBibtexContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading bibtex file ${filename}:`, error);
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

export interface BlogPostMeta {
    /** Route slug without the "blog-" prefix, e.g. "vmf". */
    slug: string;
    /** Full route path, e.g. "/blog-vmf". */
    href: string;
    title: string;
    summary: string;
    date: string;
    tags: string[];
}

/**
 * Blog post metadata, read from the content/blog-*.toml files that already
 * drive the post pages themselves.
 *
 * This used to be hand-maintained a second time in src/data/blogPosts.ts, which
 * drifted (content/blog.toml, a third copy, was missing the two newest posts).
 * Deriving it from the same files the pages render keeps index, post page, RSS
 * and sitemap in agreement by construction.
 */
export function getBlogPosts(): BlogPostMeta[] {
    const entries = fs
        .readdirSync(CONTENT_DIR)
        .filter(name => name.startsWith('blog-') && name.endsWith('.toml'));

    return entries
        .map(name => {
            const slug = name.slice('blog-'.length, -'.toml'.length);
            const config = getTomlContent<{
                title?: string;
                description?: string;
                date?: string;
                tags?: string[];
            }>(name);

            if (!config?.title || !config.date) return null;

            return {
                slug,
                href: `/blog-${slug}`,
                title: config.title,
                summary: config.description ?? '',
                date: config.date,
                tags: config.tags ?? [],
            } satisfies BlogPostMeta;
        })
        .filter((post): post is BlogPostMeta => post !== null)
        .sort((a, b) => b.date.localeCompare(a.date));
}
