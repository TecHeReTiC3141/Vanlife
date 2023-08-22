import {db} from './firebase';
import {
    collection, // returns collection ref
    doc, // returns document ref
    getDoc, // get snapshot of document
    getDocs, // get snapshot of collection or query
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    orderBy,
} from 'firebase/firestore/lite';

const vansCollectionRef = collection(db, 'vans');
const usersCollectionRef = collection(db, 'users');
const reviewsCollectionRef = collection(db, 'reviews');

export function tryCatchDecorator(func) {

    return async function () {
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

// Vans management

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

export async function updateVan(id, data) {
    const van = doc(db, "vans", id);
    await updateDoc(van, data);
}

export async function deleteVan(id) {
    const van = doc(db, "vans", id);
    await deleteDoc(van);
}

// Users CRUD

export async function createUser(id, data) {
    console.log('in create user', id, data);
    await setDoc(doc(db, 'users', id), data);
}

export async function getCurrentUser(id) {
    if (!id) return null;
    const userRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userRef);
    return {
        uid: userSnapshot.id,
        ...userSnapshot.data(),
    }
}

export async function updateUserData(id, data) {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, data);
}

// Reviews CRUD

export async function createReview(userId, vanId, rating, reviewText) {
    const curVan = await getVan(vanId);
    const data = {
        userId,
        vanId,
        stars: rating,
        text: reviewText,
        publishTime: new Date(),
        hostId: curVan.hostId,

    }

    await addDoc(reviewsCollectionRef, data);
}

async function proceedReview(rev, inHost=false) {
    const user = await getDoc(doc(db, 'users', rev.data().userId));
    let van;
    if (inHost) {
        van = await getDoc(doc(db, 'vans', rev.data().vanId));
    }
    return {
        ...rev.data(),
        id: rev.id,
        userName: user.data().name,
        vanName: inHost && van.data().name,
    }
}

export async function getVanReviews(vanId) {
    const q = query(reviewsCollectionRef,
        where('vanId', '==', vanId),
        orderBy('publishTime', 'desc'));

    const reviewSnap = await getDocs(q);

    const reviews = [];
    for (let rev of reviewSnap.docs) {
        reviews.push(await proceedReview(rev));
    }
    return reviews;
}

export async function getHostReviews(hostId) {
    const q = query(reviewsCollectionRef, 
        where('hostId', '==', hostId));
    const reviewsSnap = await getDocs(q);

    
    const reviews = [];
    for (let rev of reviewsSnap.docs) {
        reviews.push(await proceedReview(rev, true));
    }
    return reviews;
}

