import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { withBase } from '../lib/nav';

export async function GET(context) {
	const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
	const siteURL = new URL(import.meta.env.BASE_URL, context.site);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: siteURL,
		items: posts.map((post) => ({
			...post.data,
			link: withBase(`blog/${post.id}/`),
		})),
	});
}
