# Editing content without hand-writing Astro files

The site now has two editing paths. Use whichever is convenient for the kind
of work you are doing.

## Pages CMS

The repository root contains `.pages.yml`. It defines two collections:

- **Chronicler posts** → `src/content/blog/`
- **Archivist library** → `src/content/library/`

Open [app.pagescms.org](https://app.pagescms.org), sign in with GitHub, install
the Pages CMS GitHub App for the repository, and open the `DnCold/website`
repository. The CMS edits the files directly; after a change reaches `main`,
the existing GitHub Actions workflow builds and publishes the Astro site.

The media library writes new uploads to `public/media/`. Body images can be
inserted from there. Existing Astro hero images are still represented by their
relative asset path because Astro's local image pipeline expects that format.

## The shared Archivist library

Each reusable entry lives in `src/content/library/` and receives a permanent
URL such as `/archivist/sketchbook/`. The Archivist shelf links to these records.
Posts can reference them in frontmatter:

```yaml
library:
  - sketchbook
  - motion-room
```

The post automatically renders a **Filed in The Archivist** box linking back to
the canonical records. This keeps the description and artwork in one place.

To add a new record:

1. Create a Markdown file in `src/content/library/`.
2. Choose `sketchbook`, `motion-room`, or `render-vault` as its `chapter`.
3. Add a title, description, tags, status, and notes.
4. Run `npm run build`.

## DanCold Desk (Tauri)

The local editor lives in `apps/dancold-desk/` and is deliberately ignored by
Git. It is useful when you want a
proper Markdown workspace, a local Astro build check, or a guided publish flow.

```sh
cd apps/dancold-desk
npm install
npm run tauri dev
```

Point the project folder field at the repository root. **Save draft** writes a
Markdown file. **Check build** runs Astro. **Publish via PR** writes the file,
builds the site, creates a `content/<slug>` branch, pushes it, and opens a Pull
Request using your local `git` and `gh` credentials.

The app never embeds a GitHub token in the frontend and never publishes straight
to `main`.

## Which one should I use?

- Use **Pages CMS** from any computer when editing straightforward content or
  media.
- Use **DanCold Desk** when writing longer Markdown/MDX, checking the local
  render, or publishing a more involved field note.
