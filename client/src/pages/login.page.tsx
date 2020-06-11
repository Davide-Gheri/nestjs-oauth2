import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Typography } from '@material-ui/core';
import { GuestLayout } from '../components/layouts';
import { LoginForm } from '../components/guest';

const LoginPage: React.FC<RouteComponentProps> = () => {
  return (
    <GuestLayout>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <LoginForm/>
    </GuestLayout>
  )
};

export default LoginPage;
