import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Button } from '@material-ui/core';
import NavBar from '../Routes/NavBar';

class Test extends React.Component {
    changeRoute = (pathname, search) => {
        this.props.router.history.push({
            pathname: pathname,
            search: search,
        })
    }

    render() {
        const { device, router} = this.props;
        return (
            <div>
                <NavBar device={device} router={router} />
                <div>{'DEVICE: ' + device}</div>
                <Button onClick={() => this.changeRoute('/', '')} variant='contained' color='primary'>Landing</Button>

            </div>
        )
    }
}

Test.propTypes = {
    device: PropTypes.string,
    router: PropTypes.object,
};

export default withRouter(Test);