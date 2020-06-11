import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { useCurrentUser } from '../hooks';

const HomePage: React.FC<RouteComponentProps> = () => {
  const user = useCurrentUser();

  if (!user) {
    return <Redirect to="/auth/login"/>
  }
  return <Redirect to="/app"/>
}

export default HomePage;
