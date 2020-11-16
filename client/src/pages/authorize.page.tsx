import React from 'react';
import { RouteComponentProps } from 'react-router';
import { GuestLayout } from '../components/layouts';
import { Typography } from '@material-ui/core';
import { AuthorizeForm } from '../components';

const AuthorizePage: React.FC<RouteComponentProps> = () => {
  return (
    <GuestLayout>
      <Typography component="h1" variant="h5">
        Authorize
      </Typography>
      <AuthorizeForm/>
    </GuestLayout>
  )
}

export default AuthorizePage;
