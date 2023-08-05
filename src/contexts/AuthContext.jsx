import React from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth';
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

    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return redirect('/profile');
        } catch (err) {
            return err.message;
        }
    }

    const value = {
        currentUser,
        signup,
        login,
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    );
}

export default AuthProvider;