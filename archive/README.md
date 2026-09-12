# Archive

Material for two pages that were taken off the site — `/misc` ("Elsewhere") and
`/teaching`. Nothing here is built, typechecked or linted: `archive/` sits
outside `src/` and `content/`, and is excluded in `tsconfig.json` and
`eslint.config.mjs`.

It is kept so the content is not lost. The code is a snapshot of the old design
system and will not drop back in unchanged.

## elsewhere/

| File | Was |
| --- | --- |
| `MiscPage.tsx`, `MiscLayout.tsx` | the `/misc` route |
| `Random.tsx` | the "About Me" prose — the writing is the part worth keeping |
| `Gallery.tsx` | nine-photo grid with a lightbox; the images are still in `content/gallery-originals/` and `public/assets/img/gal/` |
| `WorldMap.tsx`, `world-countries.json` | places lived and visited, drawn with `react-simple-maps` |
| `TechStack.tsx` | tool logos, hot-linked from third-party CDNs |
| `GitHubContributions.tsx` | contribution graph, fetched at build time with `GITHUB_TOKEN` |

## teaching/

| File | Was |
| --- | --- |
| `teaching.toml` | the two courses and their notes link |
| `CardPage.tsx` | the card renderer; `/teaching` was its only user |

## assets/

Files that were only reachable from those two pages, plus two that were never
linked at all. They used to sit in `public/`, so every deploy shipped 4 MB
nothing on the site pointed at.

| Path | Was |
| --- | --- |
| `assets/gallery/*.webp` | the nine gallery images (sources are still in `content/gallery-originals/`) |
| `assets/teaching/returns-to-scale.pdf` | the notes link on `/teaching` |
| `assets/CV.docx` | never linked; the editable source of `CV.pdf`, and it was publicly fetchable |
| `assets/fonts-readme.md` | a README that was being served as a web asset |

`public/CV.pdf` is deliberately still shipped: it is unlinked only because the
homepage link was removed, and a CV URL is the kind of thing that gets pasted
into applications and email signatures.

## Restoring a page

1. Move the content file back under `content/` and the components under `src/`.
2. Add a `[[navigation]]` entry in `content/config.toml` — `type = "page"` with
   the target and href. `/teaching` needs `type = "card"` in its TOML and the
   `CardPageConfig` type back in `src/types/page.ts`; `/misc` needs its own
   route directory under `src/app/`.
3. Reinstall whatever the components need — `react-simple-maps` and
   `@types/react-simple-maps` for the map, an icon library for the rest.
4. Restyle against the current tokens in `src/app/globals.css`.

Everything here is also in git history at `b697837`, before the redesign.
