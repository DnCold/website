import archivistMotion from '../assets/archivist/archivist-motion.webp';
import archivistNeutral from '../assets/archivist/archivist-neutral.webp';
import archivistRender from '../assets/archivist/archivist-render.webp';
import archivistSketchbook from '../assets/archivist/archivist-sketchbook.webp';
import chroniclerNeutral from '../assets/chronicler/chronicler-neutral.png';
import runnerActive from '../assets/coldem/runner-active.png';
import runnerFull from '../assets/coldem/runner-full.png';
import runnerHead from '../assets/coldem/runner-head.png';
import runnerWelcome from '../assets/coldem/runner-welcome.png';
import archivistChibi from '../assets/noren-icons/archivist.png';
import chroniclerChibi from '../assets/noren-icons/chronicler.png';
import runnerChibi from '../assets/noren-icons/runner.png';

/**
 * Canonical recurring characters and their reusable artwork.
 * Read /CHARACTER-LIBRARY.md before changing an identity or generating a new pose.
 */
export const characters = {
  chronicler: {
    id: 'chronicler',
    name: 'The Chronicler',
    role: 'Explorer and keeper of a travel diary from unfinished places.',
    signatureTraits: ['huge dark curls', 'beard', 'weathered cape', 'satchel', 'field notebook'],
    artwork: {
      portrait: chroniclerNeutral,
      chibi: chroniclerChibi,
    },
  },
  archivist: {
    id: 'archivist',
    name: 'The Archivist',
    role: 'Bookish curator of drawings, motion, renders, and curious objects.',
    signatureTraits: ['large messy braid', 'round glasses', 'waistcoat', 'burgundy accents', 'attitude'],
    artwork: {
      neutral: archivistNeutral,
      sketchbook: archivistSketchbook,
      motion: archivistMotion,
      render: archivistRender,
      chibi: archivistChibi,
    },
  },
  runner: {
    id: 'runner',
    name: 'The Runner',
    role: 'Streetwise mascot and guide to the Coldem game world.',
    signatureTraits: [
      'large purple rectangular head',
      'two separate black ball eyes',
      'white mouth',
      'angular crack',
      'patched streetwear',
      'lime accents',
    ],
    artwork: {
      head: runnerHead,
      full: runnerFull,
      welcome: runnerWelcome,
      active: runnerActive,
      chibi: runnerChibi,
    },
  },
} as const;

export type CharacterId = keyof typeof characters;

