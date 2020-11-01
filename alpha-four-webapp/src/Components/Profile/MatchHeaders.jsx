import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class MatchHeaders extends React.Component {
    renderHeader(id) {
        return (
            <div>{id}</div>
        )
    }

    render() {
        const { ids } = this.props;
        return (
            <div>
                {ids.map((id) => (this.renderHeader(id)))}
            </div>
        )
    }
}

MatchHeaders.propTypes = {
    ids: PropTypes.array,
};

export default MatchHeaders;