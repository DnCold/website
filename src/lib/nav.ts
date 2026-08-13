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
    { label: 'Inicio', href: withBase() },
    { label: 'Notas', href: withBase('blog/') },
    { label: 'Galería', href: withBase('gallery/') },
    { label: 'Links', href: withBase('links/') },
];
