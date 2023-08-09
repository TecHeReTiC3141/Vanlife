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
import AddVan, {action as addVanAction} from "./src/pages/Host/AddVan";
import UpdateVan, {action as updateVanAction, loader as updateVanLoader} from "./src/pages/Host/UpdateVan";
import DeleteVan, {action as deleteVanAction, loader as deleteVanLoader} from "./src/pages/Host/DeleteVan";
import NotFound from "./src/pages/NotFound"
import Login, {loader as loginLoader, action as loginAction} from "./src/pages/User/Login"
import Signup, {loader as signupLoader, action as signupAction} from "./src/pages/User/Signup"
import ResetPassword, {action as resetPasswordAction} from "./src/pages/User/ResetPassword";
import ProfileLayout, {loader as profileLoader} from "./src/pages/User/ProfileLayout";
import Profile from './src/pages/User/Profile';
import UpdateProfile, {action as updateProfileAction} from "./src/pages/User/UpdateProfile";
import Layout from "./src/components/Layout"
import HostLayout from "./src/components/HostLayout"
import Error from "./src/components/Error"
import {requireAuth, requireNonAuth} from "./utils";
import AuthProvider, {useAuth,} from './src/contexts/AuthContext';

// TODO: create fancy loading element with spinner

function App() {

    const authContext = useAuth();

    const authenticationLoader = async ({request}) =>
        await requireNonAuth(authContext, request);

    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About/>}/>
            <Route
                path="login"
                element={<Login/>}
                loader={loginLoader(authContext)}
                action={loginAction(authContext)}
            />

            <Route
                path="reset-password"
                element={<ResetPassword/>}
                loader={async ({request}) =>
                    await requireAuth(authContext, request)}
                action={resetPasswordAction(authContext)}
            />
            <Route
                path="signup"
                element={<Signup/>}
                loader={signupLoader(authContext)}
                action={signupAction(authContext)}
            />
            <Route
                path="profile"
                element={<ProfileLayout/>}
                loader={profileLoader(authContext)}
            >
                <Route index
                       element={<Profile />}
                       loader={async ({request}) =>
                    await requireAuth(authContext, request)}/>

                <Route path="update"
                       element={<UpdateProfile />}
                       loader={async ({request}) =>
                    await requireAuth(authContext, request)}
                        action={updateProfileAction(authContext)}/>
            </Route>
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
                    loader={dashboardLoader(authContext)}
                />
                <Route
                    path="income"
                    element={<Income/>}
                    loader={async ({request}) =>
                        await requireAuth(authContext, request)}
                />
                <Route
                    path="reviews"
                    element={<Reviews/>}
                    loader={async ({request}) =>
                        await requireAuth(authContext, request)}
                />
                <Route
                    path="vans"
                    element={<HostVans/>}
                    errorElement={<Error/>}
                    loader={hostVansLoader(authContext)}
                />
                <Route
                    path="add-van"
                    element={<AddVan/>}
                    loader={async ({request}) =>
                        await requireAuth(authContext, request)}
                    action={addVanAction(authContext)}
                />
                <Route
                    path="vans/update/:id"
                    element={<UpdateVan />}
                    loader={updateVanLoader(authContext)}
                    action={updateVanAction(authContext)}
                />
                <Route
                    path="vans/delete/:id"
                    element={<DeleteVan />}
                    loader={deleteVanLoader}
                    action={deleteVanAction}
                />
                <Route
                    path="vans/:id"
                    element={<HostVanDetail/>}
                    errorElement={<Error/>}
                    loader={hostVanDetailLoader(authContext)}
                >
                    <Route
                        index
                        element={<HostVanInfo/>}
                        loader={async ({request}) =>
                            await requireAuth(authContext, request)}
                    />
                    <Route
                        path="pricing"
                        element={<HostVanPricing/>}
                        loader={async ({request}) =>
                            await requireAuth(authContext, request)}
                    />
                    <Route
                        path="photos"
                        element={<HostVanPhotos/>}
                        loader={async ({request}) =>
                            await requireAuth(authContext, request)}
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
