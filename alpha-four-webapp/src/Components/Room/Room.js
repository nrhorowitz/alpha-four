import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import NavBar from '../Routes/NavBar';
import Loading from '../Loading/Loading';
import Board from './Board';
import {
    firestoreGet, realTimeCreateRoomMetaListener, realTimeCreateRoomMovesListener,
    realTimeRemoveRoomMetaListener, realTimeRemoveRoomMovesListener, 
    realTimeSubmitMoveRequest
} from '../Firebase/api';
import { withRouter } from 'react-router';
import { Button, Grid, Typography } from '@material-ui/core';
import Timer from 'react-compound-timer';
import './Room.scss';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queued: false,
            roomId: null,
            loading: true,
            metadata: null,
            moves: null,
            otherUser: {},
        }
    }

    componentDidMount() {
        const query = queryString.parse(this.props.router.location.search);
        if ('id' in query) {
            const receiveRoomMeta = (exists, metadata) => {
                if (exists) {
                    if (metadata.status === 'active') {
                        const otherUser = (metadata.users[0] === this.props.currentUser.uid) ? metadata.users[1] : metadata.users[0];
                        firestoreGet('users', otherUser).then((res) => {
                            this.setState({
                                metadata: metadata,
                                otherUser: res.data(),
                                loading: false,
                            });
                        }).then((err) => {
                            console.log(err);
                        })
                    } else {
                        console.log('INACTIVE ROOM');
                        this.setState({
                            metadata: metadata,
                            loading: false,
                        });
                        realTimeRemoveRoomMetaListener(query.id);
                        realTimeRemoveRoomMovesListener(query.id);
                    }
                } else {
                    console.log('META DOES NOT EXIST');
                }
            }
            realTimeCreateRoomMetaListener(query.id, receiveRoomMeta);
            const receiveRoomMoves = (exists, moves) => {
                if (exists) {
                    this.setState({ moves: moves });
                }
            }
            realTimeCreateRoomMovesListener(query.id, receiveRoomMoves);
            this.setState({ roomId: query.id });
        }
    }

    changeRoute = (type, value=null) => {
        if (type === 'room') {
            this.props.router.history.push({
                pathname: 'room',
                search: `id=${value}`,
            });
        }
    }

    boardOnClick = (index) => {
        const { metadata, moves, roomId } = this.state;
        const board = JSON.parse(moves[moves.length - 1]);
        const column = index % metadata.params.dimension.split(',')[1];
        const turn = (this.state.metadata.users[this.state.metadata.turn] === this.props.currentUser.uid);
        if ((board[column] === 2) && turn && (metadata.status === 'active')) {
            const uid = this.props.currentUser.uid;
            const user = (metadata.users[0] === uid) ? 0 : 1;
            const params = {
                user: user,
                column: column,
            };
            const dimensions = metadata.params.dimension.split(',');
            let moveIndex = -1
            for (let i = column + (parseInt(dimensions[0]) - 1) * parseInt(dimensions[1]); i > 0; i -= parseInt(dimensions[1])) {
                if (board[i] === 2) {
                    moveIndex = i;
                    i = -1;
                }
            }
            const newMoves = board;
            newMoves[moveIndex] = user;
            moves.push(JSON.stringify(newMoves));
            const newMetadata = { ...this.state.metadata, turn: 1 - this.state.metadata.turn };
            this.setState({ moves: moves, metadata: newMetadata });
            realTimeSubmitMoveRequest(uid, roomId, params);
        }
    }

    renderProfile(uid) {
        let username = null;
        let icon = null;
        let mmr = null;
        if (this.props.currentUser.uid === uid) {
            username = this.props.currentUser.username;
            icon = this.props.currentUser.icon;
            mmr = this.props.currentUser.mmr.connect_four;
        } else {
            username = this.state.otherUser.username;
            icon = this.state.otherUser.icon;
            mmr = this.state.otherUser.mmr.connect_four;
        }
        const turn = (this.state.metadata.users[this.state.metadata.turn] === uid);
        const win = (this.state.metadata.users[this.state.metadata.winner] === uid);
        let color = '';
        if (win) {
            color = "player-win";
        } else if (turn) {
            color = "player-turn";
        }
        return (
            <div className={color}>
                <Grid container direction='row' >
                    <div>
                        <img src={icon} alt="icon" className="room-icon-size" />
                    </div>
                    <Grid className={color}>
                        <Typography variant="h6">{username}</Typography>
                        <Typography variant="h6">{mmr}</Typography>
                    </Grid>
        
                </Grid>
            </div>
        )
    }

    render() {
        const { currentUser, device, router, firebase } = this.props;
        const { loading, metadata, moves } = this.state;
        if (loading || moves === null) {
            return <Loading />
        }
        const otherUser = (metadata.users[0] === currentUser.uid) ? metadata.users[1] : metadata.users[0];
        return (
            <div>
                <NavBar
                    firebase={firebase}
                    currentUser={currentUser}
                    device={device}
                    router={router} />
                <div className="room-game">
                    {this.renderProfile(otherUser)}
                    <Board
                        colors={{ 0: 'tile red', 1: 'tile blue', 2: 'tile white' }}
                        data={JSON.parse(moves[moves.length - 1])}
                        dimension={metadata.params.dimension.split(',')}
                        onClick={this.boardOnClick} />
                    {this.renderProfile(currentUser.uid)}
                </div>
            </div>
        )
    }
}

Room.propTypes = {
    currentUser: PropTypes.object,
    device: PropTypes.string,
    firebase: PropTypes.object,
    router: PropTypes.object,
};

export default withRouter(Room);