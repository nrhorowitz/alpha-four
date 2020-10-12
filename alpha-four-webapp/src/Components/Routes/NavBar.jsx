import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { AppBar, Button, Toolbar, Typography, Grid} from '@material-ui/core';
import './Routes.scss';

class NavBar extends React.Component {
    changeRoute = (type) => {
        if (type === 'login') {
            this.props.router.history.push({
                pathname: 'login',
                search: 'step=login',
            });
        } else if (type === 'landing') {
            this.props.router.history.push({ pathname: '' });
        }
    }

    logout = () => {
        this.props.firebase.auth().signOut().then(() => {
            this.changeRoute('landing');
        }).catch((error) => {
            console.log(error)
        });
    }
    
    renderAuth() {
        if (this.props.currentUser === null) {
            return <Button color="inherit" variant="outlined" onClick={() => this.changeRoute('login')}>Login</Button>
        } else {
            return (
                <Grid container justify="flex-end">
                    <div className="navbar-name-container">
                        <Typography variant="h6">{this.props.currentUser.username}</Typography>
                    </div>
                    <Button color="inherit" variant="outlined" onClick={() => this.logout()}>Logout</Button>
                </Grid>
            )
        }
    }

    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Grid container>
                        <Typography variant="h6">
                            ALPHA FOUR TODO LOGO
                        </Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        {this.renderAuth()}
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}

NavBar.propTypes = {
    device: PropTypes.string,
    router: PropTypes.object,
    currentUser: PropTypes.object
};

export default withRouter(NavBar);