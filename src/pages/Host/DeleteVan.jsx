import React, { Suspense } from 'react';
import {useLoaderData, defer, Await, Form, Link, redirect, useActionData} from 'react-router-dom';
import { getHostVan, tryCatchDecorator, deleteVan } from '../../../api';

export function loader({ params }) {
    const { id } = params;
    return defer({ vans: tryCatchDecorator(getHostVan)(id)});
}

export async function action({ request, params }) {
    const { id } = params;
    const deletedVan = await tryCatchDecorator(deleteVan)(id);
    if (deletedVan.success) {
        return redirect('/host/vans');
    }
    return deletedVan.message;
}

export default function DeleteVan(props) {
    const loaderPromise = useLoaderData();
    const errorMessage = useActionData();

    function renderVan(vanData) {
        if (vanData.success) {
            return (

                <div className="w-full text-center flex flex-col items-center">
                    {errorMessage && <h3 className="bg-red-300 my-2 p-2 rounded">{errorMessage}</h3>}
                    <Form method="POST">
                        <h2 className="text-2xl mb-4">Are you sure to delete your van <span className="font-bold">
                        {vanData.data.name}
                    </span>?</h2>

                        <button className="bg-orange-500 text-white py-2 px-4 mr-2 rounded-md text-xl">Yes</button>
                        <Link to="../.." relative="path" className="decorated">Cancel</Link>
                    </Form>

                </div>
            )
        }
        const { message } = vanData;
        return (
            <h2>Error while loading vans: {message}</h2>
        )
    }

    return (
        <Suspense fallback={<h2>Loading van...</h2>}>
            <Await resolve={loaderPromise.vans}>
                {renderVan}
            </Await>
        </Suspense>
    );
}
