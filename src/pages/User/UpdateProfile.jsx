import React from "react"
import {
    useLoaderData,
    useNavigation,
    Form,
    redirect,
    useActionData,
    Link, useOutletContext,
} from "react-router-dom"

export const action = (AuthContext) => async({ request }) => {
    const { signup } = AuthContext;

    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const passwordConfirm = formData.get("confirm-password")
    console.log(email, password, passwordConfirm);
    if (password !== passwordConfirm) return "Passwords don't match"
    const pathname = new URL(request.url)
        .searchParams.get("redirectTo") || "/profile"

    return signup(email, password, pathname);
}

export default function UpdateProfile() {
    const errorMessage = useActionData()
    const navigation = useNavigation()
    const { user } = useOutletContext()
    return (
        <div className="login-container flex flex-col justify-center items-center h-full">
            <h1 className="font-bold text-2xl my-4">Update account</h1>
            {errorMessage && <h3 className="bg-red-300 my-2 p-2 rounded">{errorMessage}</h3>}

            <Form
                method="post"
                className="login-form"
                replace
            >
                <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />

                <input
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />
                <button
                    disabled={navigation.state === "submitting"}
                >
                    {navigation.state === "submitting"
                        ? "Signing up..."
                        : "Sign up"
                    }
                </button>
            </Form>
            <h3>Already have an account?
                <Link to="/login"
                      className="text-blue-400 hover:underline hover:text-blue-500"> Log in</Link>
            </h3>
        </div>
    )
}
