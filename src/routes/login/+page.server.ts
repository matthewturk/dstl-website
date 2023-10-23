import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
    login: async ({request, cookies}) => {
        const data = await request.formData();
        const credentials = {
            name: data.get("name"),
            password: data.get("password")
        }
        console.log("Credentials", credentials);
    }
}