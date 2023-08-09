import React from 'react';
import {defer, Await, Form, Link, redirect, useActionData, useLoaderData, useNavigation} from "react-router-dom";
import { getHostVan, tryCatchDecorator, updateVan } from "../../../api";
import { requireAuth } from "../../../utils";
import Loading from "../../components/Loading";

export const action = (AuthContext) => async({ request, params }) => {
    const { id } = params;

    const formData = await request.formData();
    const name = formData.get('name'),
        price = formData.get('price'),
        type = formData.get('type'),
        description = formData.get('description');
    console.log(name, price, type, description);
    const data = {
        name, price, type, description,
    }
    const updatedVan = await tryCatchDecorator(updateVan)(id, data);
    if (updatedVan.success) {
        return redirect(`../vans/${id}`);
    }
    return updatedVan.message;
    // const newVan = await tryCatchDecorator(createVan)(data);
    // console.log(newVan);
    // if (newVan.success) {
    //     throw redirect(`../vans/${newVan.data.id}`);
    // }
    // return newVan.message;
}

export const loader = (AuthContext) => async ({ request, params }) => {
    await requireAuth(AuthContext, request);
    const { id: currentVanId } = params;
    console.log(currentVanId);
    return defer({ van: tryCatchDecorator(getHostVan)(currentVanId)})
}

export default function UpdateVan() {
    const errorMessage = useActionData()
    const navigation = useNavigation()
    const loaderPromise = useLoaderData()

    function renderUpdateVanForm(vanData) {
        console.log(vanData);
        if (vanData.success) {
            const { data: van } = vanData;
            return (
                <div className="flex flex-col justify-center items-center h-full">
                    <h1 className="font-bold text-2xl my-4">Update your van</h1>
                    {errorMessage && <h3 className="bg-red-300 my-2 px-2 py-1 rounded">{errorMessage}</h3>}

                    <Form
                        method="post"
                        className="flex flex-col items-center max-w-full"
                        replace
                    >
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <div className="grow-0">
                                <p>Name</p>
                                <input type="text" name="name" id="name" defaultValue={van.name}
                                       className="mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2" required />
                            </div>

                            <div className="grow-0">
                                <p>Price</p>
                                <input type="number" name="price" id="price" min="0" defaultValue={van.price}
                                       className="mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2" required />
                            </div>

                            <div className="grow">
                                <p>Type</p>
                                <select name="type" id="type" defaultValue={van.type}
                                        className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2" required>
                                    <option value="simple">simple</option>
                                    <option value="rugged">rugged</option>
                                    <option value="luxury">luxury</option>
                                </select>
                            </div>

                        </div>

                        <label htmlFor="description" className="w-full block">
                            <p>Description</p>
                            <textarea
                                name="description" defaultValue={van.description}
                                className="w-full mb-4 mt-1 border border-gray-400 focus:outline-blue-300 rounded py-1.5 indent-2"
                            ></textarea>
                        </label>

                        <button
                            disabled={navigation.state === "submitting"}
                            className="bg-orange-500 text-white py-3 my-2 w-full rounded-md text-xl"
                        >
                            {navigation.state === "submitting"
                                ? "Creating..."
                                : "Create"
                            }
                        </button>
                    </Form>
                </div>
            );
        }


    }
    return (
        <section>
            <React.Suspense fallback={<Loading text="van"/>}>
                <Await resolve={loaderPromise.van}>
                    {renderUpdateVanForm}
                </Await>
            </React.Suspense>
        </section>
    )
}
