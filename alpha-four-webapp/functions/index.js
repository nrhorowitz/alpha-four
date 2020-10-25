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
            const movezeroArray = new Array(7 * 7).fill(2);
            const movezero = JSON.stringify(movezeroArray);
            const roomData = {
                'metadata': {
                    'todotimestamp1': 'dog',
                    'ranked': true,
                    'mmr': 'todommr',
                    'status': 'active',
                    'type': 'connect-four',
                    'params': {
                        'dimension': '7,7'
                    },
                    'users': {
                        0: context.params.uid,
                        1: otherkey,
                    },
                    'winner' : 2
                },
                'permissions': {
                    [context.params.uid]: true,
                    [otherkey]: true,
                },
                'requests': {
                    [context.params.uid] : -1,
                    [otherkey] : -1
                },
                'moves': {
                    0: movezero,
                }
            };
            app.database().ref('rooms/' + roomkey).set(roomData);
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


exports.handleRequest = functions.database.ref('rooms/{roomId}/requests/{uid}')
    .onUpdate((change, context) => {

        app.database().ref('rooms/'+context.params.roomId).once('value').then((snap) => {
            const original = change.after.val();
            const num_moves = Object.keys(snap.val().moves).length
            var board = snap.val().moves[num_moves - 1]
            
            const turn = (Object.keys(snap.val().moves).length - 1) % 2
            if (original.user === turn) {
                boardArr = board.substr(1,board.length-2).split(",")
                boardArr[original.index] = original.user
                var newBoard = '[' + boardArr.join(',') + ']'
                console.log(boardArr)
                console.log(newBoard)
                var new_moves = snap.val().moves
                new_moves[num_moves] = newBoard
                return app.database().ref("rooms/"+context.params.roomId).set({
                    moves : new_moves
                })
            } else {
                return null;
            }
        }).catch((err) => {console.log(err)});
    });
const isWon = (board) => {
    
}
exports.handleMove = functions.database.ref('rooms/{roomId}/moves')
    .onUpdate((change, context) => {

        const moves = change.after.val()
        const n = 7 //change to make this actually dynamic
        const currState  = moves[Object.keys(moves).length - 1]
        const temp = currState.substr(1,currState.length-2).split(",")
        const board_arr = [];
        while(temp.length) board_arr.push(temp.splice(0, n));

    });