import { redirect } from "react-router-dom"

export async function requireAuth(authContext, request) {
    const { currentUser } = authContext;

    const pathname = new URL(request.url).pathname
    console.log(`in require auth ${JSON.stringify(currentUser)} ${pathname}`)
    if (!currentUser) {
        throw redirect(
            `/login?message=You must log in first.&redirectTo=${pathname}`
        )
    }
    return currentUser;
}

export async function requireNonAuth(authContext, request) {
    const { currentUser } = authContext;
    console.log(`in require non auth ${JSON.stringify(currentUser)}`)

    if (currentUser) {
        throw redirect('/profile')
    }
    return null;
}

