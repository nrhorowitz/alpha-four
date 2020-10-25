import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import CreateAccountDisplay from './CreateAccountDisplay';
import LoginDisplay from './LoginDisplay';
import NotFound from '../NotFound/NotFound';
import { withRouter } from 'react-router';
import { firestorePost } from '../Firebase/api';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            error: {
                location: '',
                type: '',
            },
            loading: true,
        }
    }

    onChange = (type, value) => {
        this.setState({...this.state, [type]: value})
    }

    onSubmit = (type) => {
        if (type === 'login') {
            this.firebaseLogin();
        } else if (type === 'createAccount') {
            this.firebaseCreateAccount();
        }
    }

    changeRoute = (type) => {
        if (type === 'login') {
            this.props.router.history.push({
                pathname: 'login',
                search: 'step=login',
            });
        } else if (type === 'create') {
            this.props.router.history.push({
                pathname: 'login',
                search: 'step=create',
            });
        }
    }

    firebaseLogin = () => {
        const { email, password } = this.state;
        this.props.firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            this.props.router.history.push({ pathname: '/' });
        }).catch((err) => {
            const error = { location: this.props.router.location.search, type: err.code };
            this.setState({ error: error });
        });
    }

    firebaseCreateAccount = () => {
        const { firebase, router } = this.props;
        const { email, password, username } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
            const data = {
                icon: 'https://firebasestorage.googleapis.com/v0/b/alpha-four.appspot.com/o/icons%2Fredamongus.png?alt=media&token=98087572-eac2-4980-a2bd-20623bd17ace',
                mmr: {
                    connect_four: 1200,
                },
                username: username,
            };
            firestorePost('users', data, res.user.uid).then(() => {
                router.history.push({
                    pathname: '/',
                });
            }).catch((err) => {
                const error = { location: router.location.search, type: err.code };
                this.setState({ error: error });
            });
        }).catch((err) => {
            const error = { location: router.location.search, type: err.code };
            this.setState({ error: error });
        });
    }

    renderDesktop() {
        const { router, location } = this.props;
        const query = queryString.parse(router.location.search)
        if (query.step === 'login') {
            return <LoginDisplay
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                password={this.state.password}
                email={this.state.email}
                error={this.state.error}
                changeRoute={this.changeRoute}
                location={location} />
        } else if (query.step === 'create') {
            return <CreateAccountDisplay
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                username={this.state.username}
                password={this.state.password}
                email={this.state.email}
                error={this.state.error}
                changeRoute={this.changeRoute}
                location={location} />
        }
        return <NotFound />
    }

    renderMobile() {
        //TODO
        return this.renderDesktop();
    }

    render() {
        const { device } = this.props;
        return (
            <div>
                { (device === 'mobile') ? this.renderMobile() : this.renderDesktop() }
            </div>
        )
    }
}

Login.propTypes = {
    device: PropTypes.string,
    firebase: PropTypes.object,
    currentUser: PropTypes.object,
};

export default withRouter(Login);