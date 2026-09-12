export interface BasePageConfig {
    type: 'about' | 'card' | 'text' | 'news';
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

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    link_text?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
