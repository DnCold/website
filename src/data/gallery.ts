/**
 * Gallery chapter content.
 *
 * Add, remove, or rewrite chapters here. The gallery page builds its selector
 * and detail panels from this single list, so content changes do not require
 * editing the interactive component.
 */
export type GalleryChapter = {
	id: string;
	number: string;
	title: string;
	label: string;
	summary: string;
	description: string;
	status: string;
	tags: string[];
	accent: string;
};

export const GALLERY_CHAPTERS: GalleryChapter[] = [
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
		accent: '#9edee8',
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
		accent: '#e5a679',
	},
	{
		id: 'render-vault',
		number: '03',
		title: 'The Render Vault',
		label: '3D',
		summary: 'Models, spaces, materials, and strange objects.',
		description:
			'Experiments in form and light: models, environments, material studies, renders, and small spatial ideas.',
		status: 'Vault access pending',
		tags: ['3D', 'rendering', 'environments'],
		accent: '#c8a7df',
	},
];
