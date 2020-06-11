import React, { forwardRef } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { Perms, userCan } from '../../utils';

export const ProtectedRoute = forwardRef<any, RouteProps & { resource: string; perm: Perms }>(({ resource, perm, component, ...rest }, ref) => {
  const can = userCan(resource, perm);

  const Comp: any = component;

  return <Route {...rest} ref={ref} render={props => {
    if (!can) {
      return <Redirect to="/app"/>
    }
    return <Comp {...props}/>
  }}/>
})
