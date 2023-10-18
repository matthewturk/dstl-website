import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
    // This is where we'd get the story from the database
    const story = {
        comments: 'These are my comments.',
        motivations: ['motivation one', 'motivation two', 'motivation three'],
        datasets: [
            {'url': 'http://localhost/stuff.csv'}
        ],
        visualizations: [
            {}
        ]
    }
    return { story };
}