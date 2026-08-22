## Personal Site

Source for [glenntfung.github.io](https://glenntfung.github.io). Built with
Next.js (App Router) and exported as a static site. It started from the
[PRISM](https://github.com/xyjoey/PRISM) template.

### Local development
```bash
npm install --legacy-peer-deps
npm run dev
# visit http://localhost:3000
```

### Build
```bash
npm run build
```

`next.config.ts` sets `output: 'export'`, so `npm run build` writes the complete
static site to `out/`. (There is no separate `next export` step; that command was
removed in Next 14.) Serve it locally with any static file server:

```bash
npx serve out
```

### Checks
```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run links      # dead internal links + missing assets in out/ (build first)
```

### Content

All copy lives in `content/`, so editing the site does not mean editing React.

| File | Drives |
| --- | --- |
| `config.toml` | Site metadata, social links, navigation |
| `bio.md` | Homepage "A bit about me" |
| `news.toml` | Homepage "Lately" and `/news` |
| `teaching.toml` | `/teaching` |
| `blog-<slug>.toml` | One blog post: title, description, date, tags, TOC depth |
| `blog/<slug>.md` | That post's body (Markdown, LaTeX via `$...$`, fenced code) |
| `publications.bib` | `/publications` (not linked from nav — see the file header) |

**Adding a post.** Write `content/blog/<slug>.md`, add
`content/blog-<slug>.toml` beside it, then add a `[[navigation]]` entry with
`hidden = true` in `config.toml` so the route gets generated. The `/blog` index,
`sitemap.xml` and `feed.xml` all read the TOML files, so nothing else needs
updating.

### Deploy

`.github/workflows/ci.yml` installs, lints, typechecks, builds, link-checks and
deploys to GitHub Pages on push to `main`. The GitHub activity graph on
`/misc` is generated at build time using the workflow's built-in `GITHUB_TOKEN`,
so no custom repository secret is required.

## License

MIT — see [LICENSE](LICENSE).
