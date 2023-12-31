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
    const { updateUser } = AuthContext;

    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const passwordConfirm = formData.get("confirm-password")
    const age = formData.get("age")
    const name = formData.get("name")
    if (password !== passwordConfirm) return "Passwords don't match"

    return updateUser(email, password, {
        age, name
    });
}

export default function UpdateProfile() {
    const errorMessage = useActionData()
    const navigation = useNavigation()
    const { user } = useOutletContext()
    return (
        <div className=" flex flex-col justify-center items-center h-full">
            <h1 className="font-bold text-2xl my-4">Update account</h1>
            {errorMessage && <h3 className="bg-red-300 my-2 p-2 rounded">{errorMessage}</h3>}

            <Form
                method="post"
                className="text-center"
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
                    placeholder="Leave blank to keep the same"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />

                <input
                    name="confirm-password"
                    type="password"
                    placeholder="Leave blank to keep the same"
                    className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                />

                <div className="flex w-full justify-between gap-4">
                    <input
                        name="name"
                        type="text"
                        defaultValue={user.name}
                        className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                    />
                    <input
                        name="age"
                        type="number"
                        defaultValue={user.age}
                        className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                    />
                </div>

                <button
                    disabled={navigation.state === "submitting"}
                    className="w-full bg-orange-500 rounded-md py-3 text-white"
                >
                    {navigation.state === "submitting"
                        ? "Updating..."
                        : "Update"
                    }
                </button>
            </Form>
                <Link to=".."
                      className="text-blue-400 hover:underline hover:text-blue-500">Cancel</Link>
        </div>
    )
}
