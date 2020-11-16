import React from 'react';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useLocation, Link } from 'react-router-dom';
import { useGuestStyles } from './styles';
import { useRegister } from '../../hooks';

export const RegisterForm: React.FC = () => {
  const classes = useGuestStyles();
  const { onSubmit, register, errors, error, payload, watch } = useRegister();
  const { search } = useLocation();

  const errorMessage = (error && payload) && (Array.isArray(payload.message) ? payload.message[0] : payload.message || 'Cannot create user, please try again');

  const validatePassword = (value: string) => value === watch('passwordConfirm') || 'Password does not match';

  return (
    <form noValidate onSubmit={onSubmit} className={classes.form}>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              {errorMessage}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
            inputRef={register({ required: 'First name required' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            inputRef={register({ required: 'Last name required' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={register({ required: 'Email required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="nickname"
            label="Nickname"
            name="nickname"
            inputRef={register({ required: 'Nickname required' })}
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({ required: 'Password required', validate: validatePassword })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            id="passwordConfirm"
            autoComplete="current-password"
            inputRef={register({ required: 'Confirm Password required' })}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm?.message}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <Link to={`/auth/login${search}`}>
            <Typography variant="body2">
              Already have an account? Sign in
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </form>
  )
}
