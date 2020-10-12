import firebase from './Firebase';

export const firestoreGet = (collection, document=null) => {
    //TODO: cache
    console.log("GET")
    const db = firebase.firestore().collection(collection);
    if (document) {
        return db.doc(document).get();
    }
    return db.get();
};

export const firestorePost = (collection, data, document = null) => {
    console.log('POST')
    const db = firebase.firestore().collection(collection);
    if (document) {
        return db.doc(document).set(data);
    }
    return db.add(data);
}