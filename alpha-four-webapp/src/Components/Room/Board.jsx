import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import './Room.scss';

class Board extends React.Component {
    renderTile(index) {
        const { colors, data, onClick } = this.props;
        return (
            <div className={colors[data[index]]} key={index} onClick={() => onClick(index)} />
        )
    }

    renderRow(rowindex) {
        const { dimension } = this.props;
        const columncount = parseInt(dimension[1]);
        const columns = [];
        for (let i = 0; i < columncount; i += 1) {
            columns.push(i + rowindex);
        }
        return (
            <Grid container direction='row' key={rowindex}>
                {columns.map((index) => (this.renderTile(index)))}
            </Grid>
        );
    }

    render() {
        const { dimension } = this.props;
        const rowcount = parseInt(dimension[0]);
        const columncount = parseInt(dimension[1]);
        const rows = [];
        for (let i = 0; i < rowcount; i += 1) {
            rows.push(i * columncount);
        }
        return (
            <div>
                {rows.map((rowindex) => (this.renderRow(rowindex)))}
            </div>
        )
    }
}

Board.propTypes = {
    colors: PropTypes.object,
    data: PropTypes.array,
    dimension: PropTypes.array,
    onClick: PropTypes.func,
};

export default Board;