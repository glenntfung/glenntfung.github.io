## Glenn Fung — Personal Site

This repo hosts my personal site. It started from the excellent [PRISM](https://github.com/xyjoey/PRISM) template.

### Local development
```bash
npm install --legacy-peer-deps
npm run dev
# visit http://localhost:3000
```

### Build / static export
```bash
npm run build
# output in .next (and /out if you run next export)
```

### Deploy (GitHub Pages)
The repo includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies, lints, builds, and deploys to GitHub Pages on push to main/master. Set `NEXT_PUBLIC_GITHUB_TOKEN` as a repo secret if you want GitHub activity to render.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
