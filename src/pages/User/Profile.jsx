import React from 'react';
import {requireAuth} from "../../../utils";
import {defer, useLoaderData, useNavigate, useOutletContext} from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

function Profile() {
    const { logout } = useAuth();

    const { user, avatarURL } = useOutletContext();
    const navigate = useNavigate();
    const [error, setError] = React.useState(null);

    async function handleLogout() {
        setError(null);
        try {
            await logout();
            return navigate('/login');
        } catch(err) {
            setError(err.message);
        }
    }

    return (
        <>
            <h1 className="text-xl text-center font-bold my-3">Hello, {user.name}</h1>
            { error &&
                <h2 className="w-full bg-red-300 py-1 my-2 text-center rounded">{error}</h2>
            }
            <h2><span className="font-bold">User email:</span> {user.email}</h2>
            <img src={avatarURL} alt="user avatar" className="my-2 rounded-md" />
            <button onClick={() => navigate('update')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded py-2
                        disabled:opacity-30">
                Update profile
            </button>

            <button onClick={handleLogout}
                    className="w-full disabled:opacity-30 mt-3">
                Log out
            </button>
        </>
    );
}

export default Profile;