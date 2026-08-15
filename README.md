# DanCold — personal archive

A static personal website built with [Astro](https://astro.build/). It collects notes, drawings,
animation, 3D experiments, and small projects in an indie-web-inspired space.

Live site: <https://dancold.quest/>

## Start locally

```sh
npm ci
npm run dev
```

Both local development and production use `/` as their base path. GitHub Pages serves the production build at `dancold.quest`.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the static site into `dist/` |
| `npm run preview` | Serves the production build locally |

## Where to edit things

- Character identities, approved traits, prompts, and canonical art: [`CHARACTER-LIBRARY.md`](CHARACTER-LIBRARY.md)
- Reusable character asset catalog for Astro: `src/data/characters.ts`
- Site title and description: `src/consts.ts`
- Main navigation: `src/lib/nav.ts`
- Chronicler portrait: `src/assets/chronicler/chronicler-neutral.png`
- Chronicler page and styles: `src/pages/blog/index.astro` and `src/styles/chronicler.css`
- Chronicler entries: `src/content/blog/`
- Shared Archivist library: `src/content/library/`
- Archivist shelves: `src/data/archivist.ts`
- Archivist reaction portraits: `src/assets/archivist/`
- Archivist page and styles: `src/pages/archivist/index.astro` and `src/styles/archivist.css`
- Coldem games world and launcher page: `src/pages/coldem.astro`
- Coldem world styles: `src/styles/coldem.css`
- Homepage retro noren: `src/assets/noren-retro-v3.gif`
- Standard hub noren: `src/assets/noren-fabric-v2.webp` and `src/assets/noren-rail-v2.webp`
- Header markup and homepage-only retro chrome: `src/components/Header.astro`
- About dossier page and styles: `src/pages/about.astro` and `src/styles/about.css`
- Page content: `src/pages/`
- Global colors and typography: `src/styles/global.css`

For visual editing from GitHub, open Pages CMS after installing the repository's
GitHub App. Its schema is in [`.pages.yml`](.pages.yml). For the local-only
Markdown workspace with preview and a guarded Pull Request flow, see the
[`Pages CMS + DanCold Desk guide`](docs/PAGES-CMS-AND-DANCOLD-DESK.md). The
`apps/dancold-desk/` folder is deliberately ignored and stays on your computer.

For the full, step-by-step maintenance guide in Spanish, read
[`docs/EDITING-GUIDE.md`](docs/EDITING-GUIDE.md).

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and publishes the website after every push to
`main`. GitHub Pages must use **Settings → Pages → Source: GitHub Actions**.
