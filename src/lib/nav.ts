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
	{ label: 'Home', href: withBase() },
	{ label: 'Notes', href: withBase('blog/') },
	{ label: 'The Archivist', href: withBase('archivist/') },
	{ label: 'Coldem', href: withBase('coldem/') },
	{ label: 'Links', href: withBase('links/') },
];
