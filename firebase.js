// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyC6vvQSMKvroT5aeQ5s-VImfwytCuBLSFE",
    authDomain: "vanlife-5cfcc.firebaseapp.com",
    projectId: "vanlife-5cfcc",
    storageBucket: "vanlife-5cfcc.appspot.com",
    messagingSenderId: "285252701436",
    appId: "1:285252701436:web:47f97cec6b4e46d4575b79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function checkNetworkConnectivity() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => reject("Network Error"));
        xhr.addEventListener("timeout", () => reject("Request Timed Out"));
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        });
        xhr.open("GET", "https://www.google.com");
        xhr.send();
    });
}