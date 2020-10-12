import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../Routes/NavBar';
import { withRouter } from 'react-router';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 'a',
        }
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
            </div>
        )
    }
}

Landing.propTypes = {
    device: PropTypes.string,
};

export default withRouter(Landing);