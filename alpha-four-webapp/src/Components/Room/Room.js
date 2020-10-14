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
import { Button } from '@material-ui/core';
import Timer from 'react-compound-timer';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queued: false,
            roomId: null,
            loading: true,
            metadata: null,
            moves: null,
        }
    }

    componentDidMount() {
        const query = queryString.parse(this.props.router.location.search);
        if ('id' in query) {
            const receiveRoomMeta = (exists, metadata) => {
                if (exists) {
                    if (metadata.status === 'active') {
                        this.setState({ metadata: metadata, loading: false });
                    } else {
                        realTimeRemoveRoomMetaListener(query.id);
                        realTimeRemoveRoomMovesListener(query.id);
                    }
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
        if (board[index] === 2) {
            const uid = this.props.currentUser.uid;
            const user = (metadata.users[0] === uid) ? 0 : 1;
            const params = {
                user: user,
                index: index,
            };
            realTimeSubmitMoveRequest(uid, roomId, params);
        }
    }

    renderProfile(uid) {
        return (
            <div>
                <div>{'user: ' + uid}</div>
            </div>
        )
    }

    render() {
        const { currentUser, device, router, firebase } = this.props;
        const { loading, metadata, moves } = this.state;
        if (loading || moves === null) {
            return <Loading />
        }
        return (
            <div>
                <NavBar
                    firebase={firebase}
                    currentUser={currentUser}
                    device={device}
                    router={router} />
                TODO Room
                {this.state.roomId}
                {this.renderProfile(metadata.users[0])}
                {this.renderProfile(metadata.users[1])}
                <Board
                    colors={{ 0: 'tile red', 1: 'tile blue', 2: 'tile white' }}
                    data={JSON.parse(moves[moves.length - 1])}
                    dimension={metadata.params.dimension.split(',')}
                    onClick={this.boardOnClick} />
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