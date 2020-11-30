import React from 'react';
import { TextField, FormControlLabel, Checkbox, Button, Grid, Typography, Box } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { useLocation, Link } from 'react-router-dom';
import { useLogin } from '../../hooks';
import { useGuestStyles } from './styles';
import { TfaForm } from './tfa-form';
import { Facebook } from '@material-ui/icons';
import { SocialLogins } from './social-logins';

export const LoginForm: React.FC = () => {
  const classes = useGuestStyles();
  const { onSubmit, register, errors, control, loading, requiresTfa } = useLogin();
  const { search } = useLocation();

  if (requiresTfa) {
    return (
      <TfaForm/>
    )
  }

  return (
    <Box pt={2} display="flex" alignItems="center" flexDirection="column">
      <SocialLogins/>

      <form noValidate onSubmit={onSubmit} className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          inputRef={register({ required: 'Email required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          inputRef={register({ required: 'Password required' })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <FormControlLabel
          control={
            <Controller
              name="remember"
              control={control}
              as={Checkbox}
              color="primary"
              value="1"
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="#">
              <Typography variant="body2">
                Forgot password?
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/auth/register${search}`}>
              <Typography  variant="body2">
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}
