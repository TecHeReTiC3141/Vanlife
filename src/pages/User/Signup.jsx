import React from "react"
import {
    useLoaderData,
    useNavigation,
    Form,
    redirect,
    useActionData,
    Link,
} from "react-router-dom"
import { requireNonAuth } from "../../../utils";
import userIcon from '../../assets/images/user.png';

// TODO: fix getting user data when he signs up for the first time

export const loader = (authContext) => async ({ request }) => {
    await requireNonAuth(authContext, request);
    return new URL(request.url).searchParams.get("message")
}

export const action = (AuthContext) => async({ request }) => {

    const { signup } = AuthContext;

    const formData = await request.formData()
    const email = formData.get("email"),
        password = formData.get("password"),
        passwordConfirm = formData.get("confirm-password"),
        name = formData.get("name"),
        age = formData.get("age"),
        avatarString = formData.get("avatar-url");


    console.log(email, password, passwordConfirm, avatarString);
    if (password !== passwordConfirm) return "Passwords don't match"
    const pathname = new URL(request.url)
        .searchParams.get("redirectTo") || "/profile"
    
    // const avatarBlob = document.querySelector('#avatar').files[0];
    // console.log('avatarBlob', avatarBlob)
    return signup({ email, password, pathname, name, age, avatarString });
}

export default function Signup() {
    const errorMessage = useActionData();
    const message = useLoaderData();
    const navigation = useNavigation();

    async function handleAvatarUpload(ev) {
        const avatarHandle = (await window.showOpenFilePicker({
            types: [{
                accept: {
                    'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
                }
            }],
        }))[0];
        const avatarData = await avatarHandle.getFile();

        const src = URL.createObjectURL(avatarData);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
            
            document.getElementById('avatar-url').value = base64String;
        }
        reader.readAsDataURL(avatarData);
        console.log(src);
        document.querySelector(".avatar-display").src = src;
    }

    return (
        <div className="login-container flex flex-col justify-center items-center h-full">
            <h1 className="font-bold text-2xl my-4">Create an account</h1>
            {message && <h3 className="bg-red-300 my-2 p-2 rounded">{message}</h3>}
            {errorMessage && <h3 className="bg-red-300 my-2 p-2 rounded">{errorMessage}</h3>}

            <Form
                method="post"
                className="login-form"
                encType="multipart/form-data"
                replace
            >

                <div className="w-full flex items-center gap-4">
                    <div className="w-full flex flex-col items-center">
                        <img src={userIcon} alt="user avatar" className="avatar-display w-48 cursor-pointer rounded-full"
                        onClick={handleAvatarUpload}/>
                      
                        <input type="text" name="avatar-url" id="avatar-url" className="hidden"/>
                    </div>
                    <div>
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

                    <input
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                    />
                    </div>
                    
                </div>
                

                <div className="flex gap-4">
                    <input type="text" name="name" id="name" required  placeholder="Name"
                           className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                    />
                    <input type="number" name="age" id="age" required placeholder="Age" min="0"
                           className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                    />
                </div>
                <button
                    disabled={navigation.state === "submitting"}
                    className="bg-orange-500 text-white py-3 my-2 w-full rounded-md text-xl"
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
