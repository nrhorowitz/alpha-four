import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function CreateAccountDisplay(props) {
    const classes = useStyles();
    const { onChange, onSubmit, password, email, error, changeRoute, location, username } = props;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <div className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => onChange('email', e.target.value)}
            value={email}
                  />
                  <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
            onChange={(e) => onChange('password', e.target.value)}
            value={password}
                  />
                  <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => onChange('username', e.target.value)}
            value={username}
          />
          { (error.location === location.search) && <Typography variant="h5">{error.type}</Typography> }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => onSubmit('createAccount')}
          >
            CREATE ACCOUNT
          </Button>
          <Grid container>
            <Grid item xs>
              <Link onClick={() => changeRoute('')} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link onClick={() => changeRoute('login')}  variant="body2">
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
}

CreateAccountDisplay.propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    password: PropTypes.string,
    email: PropTypes.string,
    error: PropTypes.shape({
        location: PropTypes.string,
        type: PropTypes.string,
    }),
    changeRoute: PropTypes.func,
    location: PropTypes.object,
}
