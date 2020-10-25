import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Landing from '../Landing/Landing';
import NotFound from '../NotFound/NotFound';
import Login from '../Login/Login';
import Test from '../Landing/Test';
import Loading from '../Loading/Loading';
import Room from '../Room/Room';
import Profile from '../Profile/Profile';
import firebase from '../Firebase/Firebase';
import { firestoreGet } from '../Firebase/api';
import './Routes.scss';

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            loading: true,
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firestoreGet('users', user.uid).then((res) => {
                    const data = res.data();
                    data['uid'] = user.uid;
                    this.setState({ currentUser: data, loading: false });
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                this.setState({ currentUser: null, loading: false });
            }
        });
    }

    updateCurrentUser = (currentUser) => {
        this.setState({ currentUser: currentUser });
    }

    renderComponent(component, router) {
        const { currentUser } = this.state;
        const { device } = this.props;
        if (component === 'Landing') {
            return <Landing device={device} router={router} firebase={firebase} currentUser={currentUser}/>
        } else if (component === 'Login') {
            return <Login device={device} router={router} firebase={firebase} currentUser={currentUser}/>
        } else if (component === 'Room') {
            return <Room device={device} router={router} firebase={firebase} currentUser={currentUser}/>
        } else if (component === 'Profile') {
            return <Profile device={device} router={router} firebase={firebase} currentUser={currentUser} updateCurrentUser={this.updateCurrentUser}/>
        } else if (component === 'Test') {
            return <Test device={device} router={router} firebase={firebase} currentUser={currentUser}/>
        }
    }

    render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={(router) => this.renderComponent('Landing', router)}/>
                    <Route path="/login" component={(router) => this.renderComponent('Login', router)}/>
                    <Route path="/test" component={(router) => this.renderComponent('Test', router)} />
                    <Route path="/room" component={(router) => this.renderComponent('Room', router)} />
                    <Route path="/profile" component={(router) => this.renderComponent('Profile', router)} />
                    <Route path="/">
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

Routes.propTypes = {
    device: PropTypes.string,
};

export default Routes;