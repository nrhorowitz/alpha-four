import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../Routes/NavBar';
import {
    realTimeEnqueue, realTimeDequeue, realTimeCreateRoomKeyListener, realTimeRemoveRoomKeyListener, 
    realTimeClearRoomKey
} from '../Firebase/api';
import { withRouter } from 'react-router';
import { Button } from '@material-ui/core';
import Timer from 'react-compound-timer';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queued: false,
            room: null,
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

    enQueue = () => {
        //push to queue
        const { currentUser } = this.props;
        if (currentUser === null) {
            //todo login / guest login
            return;
        }
        realTimeEnqueue(currentUser.uid, 'connect-four', 'ranked').then(() => {
            this.setState({ queued: true });
        }).catch((err) => {
            console.log(err);
            //todo display some error
        });
        const receiveKey = (exists, key) => {
            if (exists) {
                console.log('receivedkey: ', key);
                this.setState({ room: key });
                realTimeRemoveRoomKeyListener(currentUser.uid, 'connect-four');
                realTimeClearRoomKey(currentUser.uid, 'connect-four');
                this.changeRoute('room', key);
            }
        }
        realTimeCreateRoomKeyListener(currentUser.uid, 'connect-four', receiveKey);
    }

    deQueue = () => {
        //pop from queue
        const { currentUser } = this.props;
        if (currentUser === null) {
            //todo login / guest login
            return;
        }
        realTimeDequeue(currentUser.uid, 'connect-four', 'ranked').then(() => {
            this.setState({ queued: false });
        }).catch((err) => {
            console.log(err);
            //todo display some error
        })
    }

    renderMatchFinder() {
        const buttonName = (this.state.queued) ? 'IN QUEUE (RANKED)' : 'PLAY RANKED';
        const disabled = this.state.queued === true;
        return (
            <div>
                <Button
                    variant='contained'
                    color='primary'
                    disabled={disabled}
                    onClick={() => this.enQueue()}
                >{buttonName}</Button>
                {this.state.queued && <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => this.deQueue()}
                >cancel</Button>}
                {this.state.queued && <Timer>
                    <Timer.Hours /> :
                    <Timer.Minutes /> :
                    <Timer.Seconds />
                </Timer>}
            </div>
        )
        
    }

    render() {
        const { currentUser, device, router, firebase } = this.props;
        return (
            <div>
                <NavBar
                    firebase={firebase}
                    currentUser={currentUser}
                    device={device}
                    router={router} />
                TODO Landing
                {this.renderMatchFinder()}
            </div>
        )
    }
}

Landing.propTypes = {
    device: PropTypes.string,
};

export default withRouter(Landing);