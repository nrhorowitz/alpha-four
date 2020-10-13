const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.matchMakingConnectFourRanked = functions.database.ref('/match-making/connect-four/{mode}/{uid}').onCreate((snapshot, context) => {
    console.log(context.params.mode, context.params.uid);
    console.log(snapshot.val());
    const roomkey = 'roomkeyjaja';
    return snapshot.ref.parent.parent.child('roomkey').set(roomkey);
});
