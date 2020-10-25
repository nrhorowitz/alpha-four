import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';

class ProfileIconModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.currentIcon,
        }
    }

    renderSingleIcon(icon) {
        const border = (this.state.selected === icon) ? "profile-icon-modal-icon-selected" : "profile-icon-modal-icon";
        return (
            <span className={border} onClick={() => this.setState({ selected: icon })}>
                <img key={icon} src={icon} alt="icon" className="profile-icon-size" />
            </span>
        )
    }

    render() {
        const { allIcons, currentIcon, changeIcon } = this.props;
        const disabled = currentIcon === this.state.selected;
        return (
            <div>
                {Object.keys(allIcons).map((icon) => this.renderSingleIcon(allIcons[icon]))}
                <Grid container className="profile-icon-modal-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={disabled}
                        onClick={() => changeIcon(this.state.selected)}
                    >SAVE CHANGES</Button>
                </Grid>
            </div>
        )
    }
}

ProfileIconModal.propTypes = {
    allIcons: PropTypes.object,
    changeIcon: PropTypes.func,
    currentIcon: PropTypes.string,
};

export default ProfileIconModal;