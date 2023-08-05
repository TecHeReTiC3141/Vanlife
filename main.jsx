import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Link
} from "react-router-dom"
import Home from "./src/pages/Home"
import About from "./src/pages/About"
import Vans, {loader as vansLoader} from "./src/pages/Vans/Vans"
import VanDetail, {loader as vanDetailLoader} from "./src/pages/Vans/VanDetail"
import Dashboard, {loader as dashboardLoader} from "./src/pages/Host/Dashboard"
import Income from "./src/pages/Host/Income"
import Reviews from "./src/pages/Host/Reviews"
import HostVans, {loader as hostVansLoader} from "./src/pages/Host/HostVans"
import HostVanDetail, {loader as hostVanDetailLoader} from "./src/pages/Host/HostVanDetail"
import HostVanInfo from "./src/pages/Host/HostVanInfo"
import HostVanPricing from "./src/pages/Host/HostVanPricing"
import HostVanPhotos from "./src/pages/Host/HostVanPhotos"
import NotFound from "./src/pages/NotFound"
import Login, {loader as loginLoader, action as loginAction} from "./src/pages/User/Login"
import Layout from "./src/components/Layout"
import HostLayout from "./src/components/HostLayout"
import Error from "./src/components/Error"
import {requireAuth} from "./utils";
import AuthProvider, {useAuth,} from './src/contexts/AuthContext';

import "./server"


function App() {

    const authContext = useAuth();

    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About/>}/>
            <Route
                path="login"
                element={<Login/>}
                loader={loginLoader}
                action={loginAction}
            />
            <Route
                path="vans"
                element={<Vans/>}
                errorElement={<Error/>}
                loader={vansLoader}
            />
            <Route
                path="vans/:id"
                element={<VanDetail/>}
                errorElement={<Error/>}
                loader={vanDetailLoader}
            />

            <Route path="host" element={<HostLayout/>}>
                <Route
                    index
                    element={<Dashboard/>}
                    loader={dashboardLoader}
                />
                <Route
                    path="income"
                    element={<Income/>}
                    loader={async ({request}) => await requireAuth(request)}
                />
                <Route
                    path="reviews"
                    element={<Reviews/>}
                    loader={async ({request}) => await requireAuth(request)}
                />
                <Route
                    path="vans"
                    element={<HostVans/>}
                    errorElement={<Error/>}
                    loader={hostVansLoader}
                />
                <Route
                    path="vans/:id"
                    element={<HostVanDetail/>}
                    errorElement={<Error/>}
                    loader={hostVanDetailLoader}
                >
                    <Route
                        index
                        element={<HostVanInfo/>}
                        loader={async ({request}) => await requireAuth(request)}
                    />
                    <Route
                        path="pricing"
                        element={<HostVanPricing/>}
                        loader={async ({request}) => await requireAuth(request)}
                    />
                    <Route
                        path="photos"
                        element={<HostVanPhotos/>}
                        loader={async ({request}) => await requireAuth(request)}
                    />
                </Route>
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Route>
    ))

    return (
        <RouterProvider router={router}/>
    )
}

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <React.StrictMode>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </React.StrictMode>
    );