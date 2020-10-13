const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const app = admin.initializeApp();
exports.matchMakingConnectFourRanked = functions.database.ref('/match-making/connect-four/ranked/{uid}').onCreate((snapshot, context) => {
    app.database().ref('match-making/connect-four/ranked').once('value').then((snap) => {
        const queue = snap.val();
        const keys = Object.keys(queue);
        if (keys.length >= 2) {
            const otherkey = (keys[0] === context.params.uid) ? keys[1] : keys[0];
            const roomsRef = snapshot.ref.parent.parent.child('rooms');
            const roomkey = roomsRef.push().getKey();
            const roomkeydata = {
                [context.params.uid]: roomkey,
                [otherkey]: roomkey,
            };
            const roomData = {
                'metadata': {
                    'todotimestamp1': 'dog',
                    'ranked': true,
                    'mmr': 'todommr',
                },
                'permissions': {
                    [context.params.uid]: true,
                    [otherkey]: true,
                },
                'requests': {
                    'todorequest1': 'dog',
                },
                'moves': {
                    'todomove1': 'dog',
                },
            };
            app.database().ref('match-making/connect-four/rooms/' + roomkey).set(roomData);
            app.database().ref('match-making/connect-four/ranked/' + context.params.uid).remove();
            app.database().ref('match-making/connect-four/ranked/' + otherkey).remove();
            return app.database().ref('match-making/connect-four/roomkey').set(roomkeydata);
        } else {
            return null;
        }
    }).catch((err) => {
        console.log(err);
    });
});
