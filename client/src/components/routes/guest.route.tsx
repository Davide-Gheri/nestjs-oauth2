import React, { forwardRef } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useCurrentUser } from '../../hooks';

export const GuestRoute = forwardRef<any, RouteProps & { redirect?: string }>(({ redirect = '/', component, ...rest }, ref) => {
  const user = useCurrentUser();

  const Comp: any = component;

  return <Route {...rest} ref={ref} render={props => {
    if (user) {
      return <Redirect to={redirect}/>
    }
    return <Comp {...props}/>
  }}/>
});
