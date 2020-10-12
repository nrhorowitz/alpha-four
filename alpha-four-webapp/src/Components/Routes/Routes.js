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
import firebase from '../Firebase/Firebase';
import './Routes.scss';

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              // ...
            } else {
              // User is signed out.
              // ...
            }
            this.setState({currentUser: user});
            // ...
        });
    }

    renderComponent(component, router) {
        const { currentUser } = this.state;
        const { device } = this.props;
        if (component === 'Login') {
            return <Login device={device} router={router} firebase={firebase} key="login" currentUser={currentUser}/>
        } else if (component === 'Test') {
            return <Test device={device} router={router} firebase={firebase} currentUser={currentUser}/>
        }
    }

    render() {
        const { device } = this.props;
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Landing device={device} />
                    </Route>
                    <Route path="/login" component={(router) => this.renderComponent('Login', router)} key="login"/>
                    <Route path="/test" component={(router) => this.renderComponent('Test', router)} />
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