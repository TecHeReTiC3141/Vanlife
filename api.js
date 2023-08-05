import { db } from './firebase';
import {
    collection, // returns collection ref
    doc, // returns document ref
    getDoc, // get snapshot of document
    getDocs, // get snapshot of collection or query
    query,
    where,
} from 'firebase/firestore/lite';

const vansCollectionRef = collection(db, 'vans')

export async function tryCatchDecorator(func) {
    try {
        const data = await func();
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

export async function getHostVans() {
    const q = query(vansCollectionRef,
        where("hostId", "==", "123"))
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