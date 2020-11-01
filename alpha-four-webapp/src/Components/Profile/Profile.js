import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../Routes/NavBar';
import { firestoreGet, firestorePost } from '../Firebase/api';
import { Grid, Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { withRouter } from 'react-router';
import './Profile.scss';
import ProfileIconModal from './ProfileIconModal';
import MatchHeaders from './MatchHeaders';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            renderProfileIconModal: false,
            allIcons: [],
            loading: true,
        }
    }

    componentDidMount() {
        firestoreGet('icons', 'profile').then((res) => {
            const data = res.data();
            this.setState({ allIcons: data, loading: false });
        }).catch((err) => {
            console.log(err);
        })
    }

    changeRoute = (type, value=null) => {
        if (type === 'room') {
            this.props.router.history.push({
                pathname: 'room',
                search: `id=${value}`,
            });
        }
    }

    changeIcon = (icon) => {
        const data = { ...this.props.currentUser, icon: icon };
        firestorePost('users', data, this.props.currentUser.uid).then((res) => {
            this.setState({ renderProfileIconModal: false });
            this.props.updateCurrentUser(data);
        }).catch((err) => {
            console.log(err);
        })
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
                Profile
                {this.state.renderProfileIconModal && <div className="profile-icon-modal-container">
                    <ProfileIconModal
                        allIcons={this.state.allIcons}
                        currentIcon={currentUser.icon}
                        changeIcon={this.changeIcon}
                    />
                </div>}
                <Grid container>
                    <Grid item xs={3} >
                        todo: badges / friendslist?
                    </Grid>
                    <Grid item xs={6}>
                        <div>
                            <div className="profile-edit-icon">
                                <IconButton size="small" onClick={() => this.setState({ renderProfileIconModal: !this.state.renderProfileIconModal })}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <img src={currentUser.icon} alt="icon" className="profile-icon-size" />
                        </div>
                        <Typography variant="h6">{currentUser.username}</Typography>
                    </Grid>
                    <Grid item xs={3} >
                        {(currentUser.games.length === 0)
                            ? <div>todo: no prev matches</div>
                            : <MatchHeaders ids={currentUser.games} />}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Profile.propTypes = {
    currentUser: PropTypes.object,
    device: PropTypes.string,
    firebase: PropTypes.object,
    router: PropTypes.object,
    updateCurrentUser: PropTypes.func,
};

export default withRouter(Profile);