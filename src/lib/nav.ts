export type NavItem = {
	label: string;
	href: string;
};

export const withBase = (path = '') => {
	const base = import.meta.env.BASE_URL.endsWith('/')
		? import.meta.env.BASE_URL
		: `${import.meta.env.BASE_URL}/`;
	const cleanPath = path.replace(/^\/+/, '');

	return `${base}${cleanPath}`;
};

export const NAV: NavItem[] = [
	{ label: 'The Chronicler', href: withBase('blog/') },
	{ label: 'The Archivist', href: withBase('archivist/') },
	{ label: 'The Storykeeper', href: withBase('writing/') },
	{ label: 'The Runner', href: withBase('coldem/') },
	{ label: 'Links', href: withBase('links/') },
];