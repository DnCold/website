/**
 * Content for The Archivist's shelves.
 *
 * The page builds its shelf selector, character reactions, and detail pages
 * from this list. Add or edit a shelf here instead of changing the template.
 */
export type ArchivistChapter = {
	id: string;
	number: string;
	title: string;
	label: string;
	summary: string;
	description: string;
	status: string;
	tags: string[];
	accent: string;
	reaction: string;
};

export const ARCHIVIST_CHAPTERS: ArchivistChapter[] = [
	{
		id: 'sketchbook',
		number: '01',
		title: 'The Sketchbook',
		label: 'Drawings',
		summary: 'Ink, studies, and unfinished lines.',
		description:
			'A shelf for illustrations, character studies, loose ideas, and the drawings that become something else later.',
		status: 'Catalog in progress',
		tags: ['illustration', 'sketches', 'character art'],
		accent: '#77937b',
		reaction: 'Mm. These margins have potential.',
	},
	{
		id: 'motion-room',
		number: '02',
		title: 'The Motion Room',
		label: 'Animation',
		summary: 'Loops, timing tests, and moving fragments.',
		description:
			'A growing collection of animation exercises, short loops, scene tests, and notes about making images move.',
		status: 'First reels being indexed',
		tags: ['2D animation', 'loops', 'motion studies'],
		accent: '#c16f4e',
		reaction: 'Oh—this one refuses to sit still.',
	},
	{
		id: 'render-vault',
		number: '03',
		title: 'The Render Cabinet',
		label: '3D',
		summary: 'Models, spaces, materials, and strange objects.',
		description:
			'Experiments in form and light: models, environments, material studies, renders, and small spatial ideas.',
		status: 'Cabinet key being found',
		tags: ['3D', 'rendering', 'environments'],
		accent: '#9a7898',
		reaction: 'A suspicious little polygon. I approve.',
	},
];
