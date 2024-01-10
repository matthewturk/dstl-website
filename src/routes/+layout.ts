import { error } from '@sveltejs/kit';
export const prerender = true;


export async function load({ route }) {
	try {
		const post = await import(`../${route.id}.md`);
		console.log(post.default);

		return {
			content: post.default,
			meta: post.metadata
		}
	} catch (e) {
		console.log(`Requested ../../pages/${route.id}.md but could not find.`);
		return { content: '', meta: {}};
	}
}