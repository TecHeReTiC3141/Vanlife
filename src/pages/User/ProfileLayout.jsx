import React from 'react';
import {requireAuth} from "../../../utils";
import {defer, useLoaderData, useNavigate, Outlet} from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

export const loader = (authContext) => async ({ request}) => {
    return await requireAuth(authContext, request);
}

function ProfileLayout() {

    const user = useLoaderData();
    const [error, setError] = React.useState(null);

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="border border-gray-300
             w-[25rem] px-4 pb-3 mb-2 rounded">
                <Outlet context={{ user }} />
            </div>
        </div>

    );
}

export default ProfileLayout;