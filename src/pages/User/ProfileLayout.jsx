import React from 'react';
import {requireAuth} from "../../../utils";
import { getUserAvatar } from '../../../api';
import {defer, useLoaderData, useNavigate, Outlet} from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

export const loader = (authContext) => async ({ request}) => {
    const user = await requireAuth(authContext, request);
    return {user, 
        avatarURL: await getUserAvatar(user.uid) };
}

function ProfileLayout() {

    const { user, avatarURL } = useLoaderData();
    const [error, setError] = React.useState(null);

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="border border-gray-300
             w-[25rem] px-4 pb-3 mb-2 rounded">
                <Outlet context={{ user, avatarURL }} />
            </div>
        </div>

    );
}

export default ProfileLayout;