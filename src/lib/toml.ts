import { parse } from 'smol-toml';

/**
 * Parse TOML into objects React can pass to Client Components.
 *
 * smol-toml 1.9 builds every table with `Object.create(null)`. React rejects
 * those null prototypes when a Server Component renders a Client Component,
 * which failed the prerender of `/_not-found` on the nav links. `structuredClone`
 * does turn the tables into plain objects, but it also turns a `TomlDate` into
 * a UTC `Date`: a date-only value stops stringifying as `2025-03-01`, and an
 * offset datetime loses its offset. Copy tables and arrays by hand and leave
 * `Date` values, including `TomlDate`, as the parser returned them. Quoted
 * date strings stay strings.
 */
export function parseToml<T = Record<string, unknown>>(source: string): T {
    return toPlain(parse(source)) as T;
}

function toPlain(value: unknown): unknown {
    if (typeof value !== 'object' || value === null || value instanceof Date) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(item => toPlain(item));
    }

    const plain: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
        plain[key] = toPlain((value as Record<string, unknown>)[key]);
    }
    return plain;
}
