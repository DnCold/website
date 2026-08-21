# The Storykeeper

The Storykeeper is the writing room for stories, poems, haikus, and short fragments. The Archivist remains focused on visual work: drawings, animation, and 3D experiments.

## Add a writing page

Create a Markdown file inside `src/content/writing/`:

```md
---
title: 'A title for the page'
description: 'One sentence shown in the Storykeeper index.'
kind: poem
pubDate: 2026-08-20
draft: false
featured: false
tags:
  - night
  - weather
---

Write the story or poem here using Markdown.
```

Allowed values for `kind` are `poem`, `story`, `fragment`, and `note`. Files with `draft: true` stay local and do not appear on the public page.

The page appears automatically at `/writing/<filename>/`, and the index is at `/writing/`.

## Change the Home phrases

Edit `src/data/short-lines.ts`. Replace the starter lines with your own haikus or short phrases. The Home panel is intentionally a small preview; the complete texts belong in `src/content/writing/`.

## Replace the character art later

The current Storykeeper window uses a small CSS portrait placeholder so the room works before final art is ready. The main character window lives in `src/pages/writing/index.astro`, and its visual rules are in `src/styles/storykeeper.css`.
