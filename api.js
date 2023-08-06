import { db } from './firebase';
import {
    collection, // returns collection ref
    doc, // returns document ref
    getDoc, // get snapshot of document
    getDocs, // get snapshot of collection or query
    query,
    where,
    addDoc,
} from 'firebase/firestore/lite';

const vansCollectionRef = collection(db, 'vans')

export function tryCatchDecorator(func) {

    return async function() {
        try {
            const data = await func.call(this, ...arguments);
            return {
                success: true,
                data,
            }
        } catch (err) {
            return {
                success: false,
                message: err.message,
            }
        }
    }

}

export async function getVans() {
    const querySnapshot = await getDocs(vansCollectionRef);
    const dataArray = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
    }))
    return dataArray
}

export async function getVan(id) {
    const docRef = doc(db, "vans", id);
    const vanSnapshot = await getDoc(docRef);
    return {
        ...vanSnapshot.data(),
        id: vanSnapshot.id,
    }
}

export async function getHostVans(userId) {
    const q = query(vansCollectionRef,
        where("hostId", "==", userId))
    const querySnapshot = await getDocs(q);
    const dataArr = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    console.log(dataArr);
    return dataArr
}

export async function getHostVan(id) {
    const docRef = doc(db, "vans", id);
    const vanSnapshot = await getDoc(docRef);
    return {
        ...vanSnapshot.data(),
        id: vanSnapshot.id,
    }
}

export async function createVan(data) {
    const newVanRef = await addDoc(vansCollectionRef, data,);
    const newVan = await getDoc(newVanRef);
    console.log(newVan.data());
    return {
        ...newVan.data(),
        id: newVan.id,
    };
}