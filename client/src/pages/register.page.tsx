import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { GuestLayout } from '../components/layouts';
import { RegisterForm } from '../components/guest';

const RegisterPage: React.FC<RouteComponentProps> = () => {
  return (
    <GuestLayout>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <RegisterForm/>
    </GuestLayout>
  )
};

export default RegisterPage;
