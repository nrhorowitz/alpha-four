import firebase from './Firebase';

export const firestoreGet = (collection, document=null) => {
    //TODO: cache
    console.log("api: GET")
    const db = firebase.firestore().collection(collection);
    if (document) {
        return db.doc(document).get();
    }
    return db.get();
};

export const firestorePost = (collection, data, document = null) => {
    console.log('api: POST')
    const db = firebase.firestore().collection(collection);
    if (document) {
        return db.doc(document).set(data);
    }
    return db.add(data);
}

export const realTimeEnqueue = (uid, type, mode) => {
    console.log('api: enqueue')
    const db = firebase.database().ref('/match-making/' + type + '/' + mode + '/' + uid);
    return db.set({ [uid]: 'todo' });
}

export const realTimeDequeue = (uid, type, mode) => {
    console.log('api: dequeue')
    const db = firebase.database().ref('match-making/' + type + '/' + mode + '/' + uid);
    return db.remove();
}

export const realTimeCreateRoomKeyListener = (uid, type, f) => {
    console.log('api: createroomkeylistener');
    const db = firebase.database().ref('match-making/' + type + '/roomkey/' + uid);
    db.on('value', (snapshot) => {
        f(snapshot.exists(), snapshot.val());
    });
}

export const realTimeRemoveRoomKeyListener = (uid, type) => {
    console.log('api: removeroomkeylistener');
    const db = firebase.database().ref('match-making/' + type + '/roomkey/' + uid);
    db.off();
}

export const realTimeClearRoomKey = (uid, type) => {
    console.log('api: clearroomkey');
    const db = firebase.database().ref('match-making/' + type + '/roomkey/' + uid);
    return db.remove();
}

export const realTimeCreateRoomMetaListener = (uid, f) => {
    console.log('api: createroommetalistener');
    const db = firebase.database().ref('rooms/' + uid + '/metadata');
    db.on('value', (snapshot) => {
        f(snapshot.exists(), snapshot.val());
    });
}

export const realTimeRemoveRoomMetaListener = (uid) => {
    console.log('api: removeroommetalistener');
    const db = firebase.database().ref('rooms/' + uid + '/metadata');
    db.off();
}

export const realTimeCreateRoomMovesListener = (uid, f) => {
    console.log('api: createroommoveslistener');
    const db = firebase.database().ref('rooms/' + uid + '/moves');
    db.on('value', (snapshot) => {
        f(snapshot.exists(), snapshot.val());
    });
}

export const realTimeRemoveRoomMovesListener = (uid) => {
    console.log('api: removeroommoveslistener');
    const db = firebase.database().ref('rooms/' + uid + '/moves');
    db.off();
}

export const realTimeSubmitMoveRequest = (uid, rid, params) => {
    console.log('api: submit move request');
    const db = firebase.database().ref('/rooms/' + rid + '/requests/' + uid);
    return db.set(params);
}