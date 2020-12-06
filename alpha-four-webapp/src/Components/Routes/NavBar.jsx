import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { AppBar, Button, Toolbar, Typography, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Routes.scss';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedDropdown: false,
        }
    }

    changeRoute = (type) => {
        if (type === 'login') {
            this.props.router.history.push({
                pathname: 'login',
                search: 'step=login',
            });
        } else if (type === 'landing') {
            this.props.router.history.push({ pathname: '' });
        } else if (type === 'profile') {
            this.props.router.history.push({
                pathname: 'profile',
                search: `id=${this.props.currentUser.uid}`,
            });
        }
    }

    logout = () => {
        this.setState({ expandedDropdown: false });
        this.props.firebase.auth().signOut().then(() => {
            this.changeRoute('landing');
        }).catch((error) => {
            console.log(error)
        });
    }

    renderExpandedDropdown() {
        return (
            <Grid container direction='column'>
                <Button color="inherit" variant="outlined" onClick={() => this.changeRoute('profile')} fullWidth>Profile</Button>
                <Button color="inherit" variant="outlined" onClick={() => this.logout()} fullWidth>Logout</Button>
            </Grid>
        );
    }
    
    renderAuth() {
        const { currentUser } = this.props;
        const expandButton = (this.state.expandedDropdown) ? <ExpandMoreIcon /> : <ExpandLessIcon />;
        if (currentUser === null) {
            return <Button color="inherit" variant="outlined" onClick={() => this.changeRoute('login')}>Login</Button>
        } else {
            return (
                <Grid container justify="flex-end">
                    <div className="navbar-icon-container">
                        <img src={currentUser.icon} alt="icon" className="navbar-icon-size" />
                    </div>
                    <div className="navbar-name-container">
                        <Typography variant="h6">{currentUser.username}</Typography>
                    </div>
                    <IconButton onClick={() => this.setState({ expandedDropdown: !this.state.expandedDropdown })}>
                        {expandButton}
                    </IconButton>
                </Grid>
            )
        }
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container>
                            <Typography variant="h6">
                                ALPHA FOUR
                            </Typography>
                        </Grid>
                        <Grid container justify="flex-end">
                            {this.renderAuth()}
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid container justify="flex-end">
                    <div className="navbar-expanded-dropdown">
                        { this.state.expandedDropdown && this.renderExpandedDropdown() }
                    </div>
                </Grid>
            </div>
        )
    }
}

NavBar.propTypes = {
    device: PropTypes.string,
    router: PropTypes.object,
    currentUser: PropTypes.object
};

export default withRouter(NavBar);