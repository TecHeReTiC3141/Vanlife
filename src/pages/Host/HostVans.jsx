import React from "react"
import { Link, useLoaderData, defer, Await } from "react-router-dom"
import { getHostVans, tryCatchDecorator } from "../../../api"
import { requireAuth } from "../../../utils"
import Loading from '../../components/Loading';

export const loader = (authContext) => async ({ request }) => {
    const currentUser = await requireAuth(authContext, request);
    return defer({ vans: tryCatchDecorator(getHostVans)(currentUser.uid) })
}

export default function HostVans() {
    const dataPromise = useLoaderData()

    function renderVanElements(vansData) {
        if (vansData.success) {
            const { data: vans } = vansData;
            const hostVansEls = vans.map(van => (
                <Link
                    to={van.id}
                    key={van.id}
                    className="w-full block flex justify-between items-center
                    bg-white rounded px-4"
                >
                    <div className="host-van-single" key={van.id}>
                        <img src={van.imageUrl} alt={`Photo of ${van.name}`} />
                        <div className="host-van-info">
                            <h3>{van.name}</h3>
                            <p>${van.price}/day</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <Link className="px-4 py-2 bg-blue-400 text-gray-100 rounded-md shadow border border-gray-600" to={`update/${van.id}`}>Update</Link>
                        <Link className="px-4 py-2 bg-red-400 text-gray-100 rounded-md shadow border border-gray-600" to={`delete/${van.id}`}>Delete</Link>
                    </div>
                </Link>
            ))
            return (
                <div className="flex flex-col gap-4 mx-4">
                    {hostVansEls}
                </div>
            )
        } else {
            const { message } = vansData;
            return (
                <h2>Error while loading vans: {message}</h2>
            )
        }

    }

    return (
        <section className="w-full">
            <h1 className="text-2xl font-bold ml-4 mb-4">Your listed vans</h1>
            <React.Suspense fallback={<Loading text={"your vans"}/>}>
                <Await resolve={dataPromise.vans}>
                    {renderVanElements}
                </Await>
            </React.Suspense>
        </section>
    )
}