import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				draft: z.boolean().default(false),
				// Transform string to Date object
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: image().optional(),
				// Reuse an Archivist entry instead of copying its description into a post.
				library: z.array(z.string()).default([]),
			}),
});

const library = defineCollection({
	// One reusable entry per artwork, experiment, character sheet, or game note.
	loader: glob({ base: './src/content/library', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		chapter: z.enum(['sketchbook', 'motion-room', 'render-vault']),
		status: z.string().default('Catalog in progress'),
		tags: z.array(z.string()).default([]),
		featured: z.boolean().default(false),
		cover: z.string().optional(),
	}),
});

const writing = defineCollection({
	// Stories, poems, haikus, and fragments that belong to The Storykeeper.
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		kind: z.enum(['poem', 'story', 'fragment', 'note']),
		pubDate: z.coerce.date(),
		draft: z.boolean().default(false),
		featured: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { blog, library, writing };
