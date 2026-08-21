# Editing content without hand-writing Astro files

The site now has three editing paths. Use whichever is convenient for the kind
of work you are doing.

## Pages CMS

The repository root contains .pages.yml. It defines three collections:

- Chronicler posts -> src/content/blog/
- Storykeeper writing -> src/content/writing/
- Archivist library -> src/content/library/

Open https://app.pagescms.org, sign in with GitHub, install the Pages CMS GitHub
App for the repository, and open the DnCold/website repository. The CMS edits
files directly; after a change reaches main, the existing GitHub Actions
workflow builds and publishes the Astro site.

The media library writes new uploads to public/media/. Body images can be
inserted from there. Existing Astro hero images are still represented by their
relative asset path because Astro's local image pipeline expects that format.

## The shared Archivist library

Each reusable entry lives in src/content/library/ and receives a permanent URL
such as /archivist/sketchbook/. The Archivist shelf links to these records.
Posts can reference them in frontmatter using library IDs such as sketchbook or
motion-room. This keeps the description and artwork in one place.

To add a new record:

1. Create a Markdown file in src/content/library/.
2. Choose sketchbook, motion-room, or render-vault as its chapter.
3. Add a title, description, tags, status, and notes.
4. Run npm run build.

## DanCold Desk (Tauri)

The local editor lives in apps/dancold-desk/. Its source can be versioned, but
it is useful only on a computer with the local project and credentials. Use it
when you want a proper Markdown workspace, a local Astro build check, or a
guided publish flow.

From that directory, run npm install and npm run tauri dev. Point the project
folder field at the repository root, for example:

    D:\DanColdCafe

Use the Chronicler or Storykeeper tab to choose the collection. The Storykeeper
tab edits poems, stories, fragments, and notes in src/content/writing/. Save
draft writes a Markdown file in the selected collection. Check build runs
Astro. Publish via PR writes the file, builds the site, creates a content branch,
pushes it, and opens a Pull Request using your local git and gh credentials.

The app never embeds a GitHub token in the frontend and never publishes straight
to main.

## Which one should I use?

- Use Pages CMS from any computer when editing straightforward content or media.
- Use DanCold Desk when writing longer Markdown/MDX, checking the local render,
  or publishing a more involved field note or Storykeeper page.
