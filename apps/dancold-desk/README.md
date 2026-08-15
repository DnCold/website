# DanCold Desk

DanCold Desk is the local companion app for the Astro site. It keeps the editing
experience close to the project while keeping GitHub credentials out of the
browser and out of the public website.

## What it does

- Reads Markdown and MDX notes from `src/content/blog/`.
- Edits frontmatter and Markdown with a split preview.
- Preserves and edits Archivist references such as `sketchbook, motion-room`.
- Saves drafts directly to the selected Astro project.
- Runs `npm run build` before a publish.
- Creates a `content/<slug>` branch, commit, push, and Pull Request through the
  local `git` and `gh` credentials.

## First run

From this directory:

```sh
npm install
npm run tauri dev
```

The project folder field should point to the root of this repository, the same
folder that contains `package.json` and `src/content/blog/`.

The publish button is intentionally explicit. It does not push directly to
`main`; it creates a Pull Request so the normal GitHub Pages workflow remains
the final gate.

## Security boundary

The Rust side validates the project root and only allows writes inside
`src/content/blog/`. The UI never receives a GitHub token. GitHub authentication
is delegated to the local `git` and `gh` installations.
