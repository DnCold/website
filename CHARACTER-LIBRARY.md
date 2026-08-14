# DanCold character library

This file is the canonical reference for recurring characters in the DanCold website. If you are an
assistant working on this repository in a later chat, read this file before generating, editing, or
replacing character art.

The machine-readable companion is [`src/data/characters.ts`](src/data/characters.ts). It exports the
same identities together with their reusable Astro image assets.

## The Chronicler

**Role:** A rough explorer who keeps a travel diary of unfinished places, failed builds, strange
trails, and useful mistakes.

**Personality:** Weathered, stubborn, observant, practical, and still taking notes. He should feel
capable rather than polished.

**Keep these traits:**

- adult man with an enormous mass of dark curls;
- visible beard and a strong, weathered silhouette;
- worn explorer's cape, layered travel clothes, straps, and satchel;
- a field notebook or other recording tool;
- ink-heavy, rough adventure-manga energy in detailed illustrations.

**Avoid:** Modern office clothes, a neat haircut, a clean fashion-model appearance, or turning him
into a generic fantasy knight.

**Canonical assets:**

- Main portrait: `src/assets/chronicler/chronicler-neutral.png`
- Noren chibi: `src/assets/noren-icons/chronicler.png`

**Prompt starter:**

> The Chronicler, a rugged adult male explorer with huge unruly dark curls, a beard, a weathered
> cape, layered travel clothes, satchel straps, and a field notebook. Stubborn, observant traveler
> documenting unfinished places. Preserve his recognizable hair, beard, cape, and notebook.

## The Archivist

**Role:** Curator of drawings, motion tests, renders, and curious objects in a cozy reading room.

**Personality:** Cute but chic, clever, warm, discerning, and a bookworm with attitude. She reacts to
the archive rather than posing like a passive receptionist.

**Keep these traits:**

- adult woman with a very large, messy dark braid;
- round glasses and an expressive, confident face;
- layered bookish clothes with a waistcoat and burgundy accents;
- a book, folio, card, or cataloging object when the pose allows it;
- warm lamplight and handmade editorial or manga texture in detailed illustrations.

**Avoid:** Sleek corporate styling, tiny or tidy hair, rectangular glasses, or a generic shy-librarian
pose with no attitude.

**Canonical assets:**

- Neutral portrait: `src/assets/archivist/archivist-neutral.webp`
- Sketchbook reaction: `src/assets/archivist/archivist-sketchbook.webp`
- Motion reaction: `src/assets/archivist/archivist-motion.webp`
- Render reaction: `src/assets/archivist/archivist-render.webp`
- Noren chibi: `src/assets/noren-icons/archivist.png`

**Prompt starter:**

> The Archivist, a clever adult female bookworm with a huge messy dark braid, round glasses,
> expressive eyes, a tailored waistcoat, layered bookish clothing, and burgundy accents. Cute and
> chic with confident attitude, holding an archival book or folio. Preserve her braid and glasses.

## The Runner

**Role:** The living character born from DanCold's purple graffiti tag. The Runner represents the
Coldem game world first; the launcher is only one of the tools they introduce.

**Personality:** Fast, scrappy, mischievous, streetwise, energetic, and proud of being handmade.

**Keep these traits:**

- large purple rectangular head based directly on the original tag silhouette;
- two separate glossy black spherical eyes: one prominent and one peeking from the opposite side;
- small white mouth and an angular crack/detail on the head;
- compact streetwear body with patched layers and lime-green details;
- graffiti or game-running props such as a spray can, handheld device, or launcher package;
- oversized head-to-body ratio, especially in chibi and mascot art.

**Avoid:** Extra purple growths around the original head outline, white flaps beneath the head,
missing either eye, a normal human head, or making the launcher their entire identity.

**Canonical assets:**

- Transparent head: `src/assets/coldem/runner-head.png`
- Transparent full pose: `src/assets/coldem/runner-full.png`
- Transparent welcome pose: `src/assets/coldem/runner-welcome.png`
- Transparent active pose: `src/assets/coldem/runner-active.png`
- Source render: `src/assets/coldem/runner-v4.png`
- Original graffiti reference: `src/assets/coldem/dancold-logo.png`
- Noren chibi: `src/assets/noren-icons/runner.png`

**Prompt starter:**

> The Runner, a scrappy chibi game-world mascot with a very large purple rectangular graffiti-tag
> head, two separate glossy black ball eyes on opposite sides, a small white mouth, and an angular
> crack detail. Compact patched streetwear body with lime accents and a spray can. Preserve the clean
> original head silhouette with no extra purple rim and no white flaps beneath it.

## Noren icon status

The three character chibis above are approved references. These two non-character symbols are still
placeholders and can be redesigned later:

- `src/assets/noren-icons/home.png`
- `src/assets/noren-icons/links.png`

## Rules for future artwork

1. Start from the canonical asset closest to the requested pose; do not rely on text alone.
2. Preserve the traits listed under **Keep these traits** even when changing medium or clothing pose.
3. Save reusable transparent character art in the character's existing asset folder.
4. Use `src/assets/noren-icons/` only for small pixel-art navigation sprites.
5. Add every accepted pose to both this file and `src/data/characters.ts`.
6. Ask before permanently redesigning a face, silhouette, or signature prop.

