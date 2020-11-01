const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
                    'turn': 0,
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

const winCondition = (board, moveIndex, dimensions) => {
    const row = parseInt(dimensions[0]);
    const column = parseInt(dimensions[1]);
    const user = board[moveIndex];
    const rowIndex = Math.floor(moveIndex / column);
    const columnIndex = moveIndex % column;
    // horizontal
    let c = columnIndex;
    let count = 0;
    while ((c >= 0) && (board[rowIndex * column + c] === user)) {
        c -= 1;
        count += 1;
    }
    c = columnIndex;
    while ((c < column) && (board[rowIndex * column + c] === user)) {
        c += 1;
        count += 1;
    }
    if (count >= 5) { return true; }
    // vertical
    let r = rowIndex;
    count = 0;
    while ((r >= 0) && (board[r * column + columnIndex] === user)) {
        r -= 1;
        count += 1;
    }
    r = rowIndex;
    while ((r < row) && (board[r * column + columnIndex] === user)) {
        r += 1;
        count += 1;
    }
    if (count >= 5) { return true; }
    // diagonal1
    c = columnIndex;
    r = rowIndex;
    count = 0;
    while ((c >= 0) && (r >= 0) && (board[r * column + c] === user)) {
        c -= 1;
        r -= 1;
        count += 1;
    }
    c = columnIndex;
    r = rowIndex;
    while ((c < column) && (r < row) && (board[r * column + c] === user)) {
        c += 1;
        r += 1;
        count += 1;
    }
    if (count >= 5) { return true; }
    // diagonal2
    c = columnIndex;
    r = rowIndex;
    count = 0;
    while ((c >= 0) && (r < row) && (board[r * column + c] === user)) {
        c -= 1;
        r += 1;
        count += 1;
    }
    c = columnIndex;
    r = rowIndex;
    while ((c < column) && (r >= 0) && (board[r * column + c] === user)) {
        c += 1;
        r -= 1;
        count += 1;
    }
    if (count >= 5) { return true; }
    return null;
};

exports.handleMoveRequest = functions.database.ref('rooms/{roomId}/requests/{uid}').onUpdate((snapshot, context) => {
    app.database().ref('rooms/' + context.params.roomId).once('value').then((snap) => {
        const request = snapshot.after.val();
        const gameState = snap.val();
        const prevBoard = JSON.parse(gameState.moves[Object.keys(gameState.moves).length - 1]);
        const dimensions = gameState.metadata.params.dimension.split(',');
        let moveIndex = -1
        for (let i = request.column + (parseInt(dimensions[0]) - 1) * parseInt(dimensions[1]); i >= 0; i -= parseInt(dimensions[1])) {
            if (prevBoard[i] === 2) {
                moveIndex = i;
                i = -1;
            }
        }
        if ((request.user === gameState.metadata.turn) && (moveIndex !== -1)) {
            const newBoard = prevBoard;
            newBoard[moveIndex] = request.user;
            const updatedMoves = gameState.moves;
            updatedMoves.push(JSON.stringify(newBoard));
            app.database().ref('rooms/' + context.params.roomId + '/moves').set(updatedMoves);
            const win = winCondition(newBoard, moveIndex, dimensions);
            if (win !== null) {
                const newMetadata = { ...gameState.metadata, status: 'inactive', winner: request.user };
                app.database().ref('rooms/' + context.params.roomId + '/metadata').set(newMetadata);
                const createGameData = {
                    metadata: newMetadata,
                    moves: updatedMoves,
                }
                return app.firestore().collection('game').add(createGameData);
            } else {
                app.database().ref('rooms/' + context.params.roomId + '/metadata/turn').set(1 - parseInt(request.user));
                return null;
            }
        } else {
            return null;
        }
    }).catch((err) => {
        console.log(err);
    });
});

exports.recordCompletedGame = functions.firestore.document('game/{gameId}').onCreate((snapshot, context) => {
    const data = snapshot.data();
    //todo process win mmr
    //todo update game completion in profile
});
