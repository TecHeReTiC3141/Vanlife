import React from "react"
import {
    useLoaderData,
    useNavigation,
    Form,
    redirect,
    useActionData,
    Link,
} from "react-router-dom"

export const action = (AuthContext) => async ({request}) => {

    const {resetPassword} = AuthContext;

    const formData = await request.formData()
    const email = formData.get("email")
    return resetPassword(email);
}

export default function ResetPassword() {
    const errorMessage = useActionData()
    const message = useLoaderData()
    const navigation = useNavigation()

    return (
        <div className="login-container flex flex-col justify-center items-center h-full">
            <h1 className="font-bold text-2xl my-4">Password reset</h1>
            {message && <h3 className="red my-2">{message}</h3>}
            {errorMessage && <h3 className="bg-green-300 my-2 px-2 py-1 rounded">{errorMessage}</h3>}

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

                <button
                    disabled={navigation.state === "submitting"}
                >
                    {navigation.state === "submitting"
                        ? "Sending letter..."
                        : "Reset"
                    }
                </button>
            </Form>
            <Link to="/login" className="decorated">Return to login</Link>
        </div>
    )
}
