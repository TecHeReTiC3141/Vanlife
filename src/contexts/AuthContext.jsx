import React from 'react';
import { auth, checkNetworkConnectivity } from '../../firebase';
import { signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updatePassword,
    updateEmail,
} from 'firebase/auth';
import {redirect} from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
    return React.useContext(AuthContext);
}

function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        return auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
    }, []);

    async function signup(email, password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return redirect('/profile');
        } catch (err) {
            return err.message;
        }
    }

    async function login(email, password, pathname) {
        try {
            // await checkNetworkConnectivity(); // check network connectivity
            await signInWithEmailAndPassword(auth, email, password);
            return redirect(pathname);
        } catch (err) {
            return err.message;
        }
    }

    async function logout() {
        return await signOut(auth);
    }

    async function updateUser(email, password) {
        try {
            if (email !== currentUser.email) {
                await updateEmail(auth.currentUser, email);
            }
            if (password && password !== currentUser.password) {
                await updatePassword(auth.currentUser, password);
            }
            return redirect('/profile');
        } catch(err) {
            return err.message;
        }

    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children }
        </AuthContext.Provider>
    );
}

export default AuthProvider;