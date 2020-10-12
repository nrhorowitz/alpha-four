import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { AppBar, Button, Toolbar, Typography, InputBase, Grid} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './Routes.scss';

class NavBar extends React.Component {
    changeRoute = (pathname, search) => {
        this.props.router.history.push({
            pathname: pathname,
            search: search,
        })
    }

    renderAuth() {
        //todo pull data
        const username = "TODO USERNAME";
        if (this.props.currentUser !== undefined) {
            return <Button color="inherit" variant="outlined">Login</Button>
        } else {
            return (
                <Grid container justify="flex-end">
                    <div className="navbar-name-container">
                        <Typography variant="h6">{username}</Typography>
                    </div>
                    <Button color="inherit" variant="outlined">Logout</Button>
                </Grid>
            )
        }
    }

    render() {
        const { device, router } = this.props;
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