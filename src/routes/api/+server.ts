import { json, type RequestHandler } from '@sveltejs/kit';

export const GET : RequestHandler = async () => {
   const posts = [
        {
            slug: 'sveltkit',
            content: `Something <b>big</b>`
        }
   ];
   return json(posts);
}