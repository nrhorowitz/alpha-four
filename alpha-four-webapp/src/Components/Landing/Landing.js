import React from 'react';
import PropTypes from 'prop-types';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 'a',
        }
    }

    render() {
        const { device } = this.props;
        return (
            <div>Landing</div>
        )
    }
}

Landing.propTypes = {
    device: PropTypes.string,
};

export default Landing;