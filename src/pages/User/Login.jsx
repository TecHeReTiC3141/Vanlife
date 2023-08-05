import React from "react"
import {
    useLoaderData,
    useNavigation,
    Form,
    redirect,
    useActionData,
    Link,
} from "react-router-dom"
import { loginUser } from "../../../api"

export function loader({ request }) {
    return new URL(request.url).searchParams.get("message")
}

export const action = (AuthContext) => async({ request }) => {

    const { login } = AuthContext;

    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const pathname = new URL(request.url)
        .searchParams.get("redirectTo") || "/profile"
    
    return login(email, password, pathname);
}

export default function Login() {
    const errorMessage = useActionData()
    const message = useLoaderData()
    const navigation = useNavigation()

    return (
        <div className="login-container flex flex-col justify-center items-center h-full">
            <h1 className="font-bold text-2xl my-4">Log in to your account</h1>
            {message && <h3 className="red my-2">{message}</h3>}
            {errorMessage && <h3 className="bg-red-300 my-2">{errorMessage}</h3>}

            <Form 
                method="post" 
                className="login-form" 
                replace
            >
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />
                <button
                    disabled={navigation.state === "submitting"}
                >
                    {navigation.state === "submitting"
                        ? "Logging in..."
                        : "Log in"
                    }
                </button>
            </Form>
            <h3>Don't have an account yet? <Link to="/signup"
                                            className="text-blue-400 hover:underline hover:text-blue-500">Sign up</Link></h3>
        </div>
    )
}
