# DanCold Desk

DanCold Desk is the local companion app for the Astro site. It keeps the editing
experience close to the project while keeping GitHub credentials out of the
browser and out of the public website.

## What it does

- Switches between Chronicler posts (src/content/blog/) and Storykeeper pages (src/content/writing/).
- Edits collection-specific frontmatter and Markdown with a split preview.
- Preserves Archivist references for Chronicler notes and kind, featured, and tags for Storykeeper pages.
- Saves drafts directly to the selected Astro project.
- Runs npm run build before a publish.
- Creates a branch, commit, push, and Pull Request through the local git and gh credentials.

## First run

From this directory, run npm install and npm run tauri dev.

When the app opens, choose the repository root:

    D:\DanColdCafe

Use the Chronicler / Storykeeper tabs to choose which collection to load.
The Storykeeper tab edits poems, stories, fragments, and notes in
src/content/writing/.

The publish button is intentionally explicit. It does not push directly to
main; it creates a Pull Request so the normal GitHub Pages workflow remains
the final gate.

## Security boundary

The Rust side validates the project root and only allows writes inside the
selected src/content/blog/ or src/content/writing/ collection. The UI never
receives a GitHub token. GitHub authentication is delegated to the local git
and gh installations.
