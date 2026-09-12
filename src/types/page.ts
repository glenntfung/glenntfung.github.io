export interface BasePageConfig {
    type: 'text' | 'news';
    title: string;
    description?: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    toc: 'none' | 'sections' | 'nested';
    /** ISO publication date (YYYY-MM-DD). Present on blog posts. */
    date?: string;
    /** Topic tags, shown on the post and used by the /blog filter. */
    tags?: string[];
}

