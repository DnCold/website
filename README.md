# DanCold — personal archive

A static personal website built with [Astro](https://astro.build/). It collects notes, drawings,
animation, 3D experiments, and small projects in an indie-web-inspired space.

Live site: <https://dncold.github.io/website/>

## Start locally

```sh
npm ci
npm run dev
```

The local server uses `/` as its base path. Production builds use `/website/` for GitHub Pages.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the static site into `dist/` |
| `npm run preview` | Serves the production build locally |

## Where to edit things

- Site title and description: `src/consts.ts`
- Main navigation: `src/lib/nav.ts`
- Gallery chapters: `src/data/gallery.ts`
- Gallery artwork: `src/assets/gallery/archive-guide-manga.webp`
- Page content: `src/pages/`
- Notes: `src/content/blog/`
- Global colors and typography: `src/styles/global.css`

For the full, step-by-step maintenance guide in Spanish, read
[`docs/EDITING-GUIDE.md`](docs/EDITING-GUIDE.md).

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and publishes the website after every push to
`main`. GitHub Pages must use **Settings → Pages → Source: GitHub Actions**.
