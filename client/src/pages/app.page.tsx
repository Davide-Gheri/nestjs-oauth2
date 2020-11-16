import React, { Suspense, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { AppLayout, Loading, ProtectedRoute } from '../components';
import { asyncLoad } from '../utils';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../apollo/client';
import { useCurrentUser } from '../hooks';
import { Roles } from '../generated/graphql';

const AsyncDashboard = asyncLoad(() => import('./app/dashboard.page'));
const AsyncClients = asyncLoad(() => import('./app/clients.page'));
const AsyncClientDetail = asyncLoad(() => import('./app/client.detail.page'));
const AsyncUsers = asyncLoad(() => import('./app/users.page'));
const AsyncUserDetail = asyncLoad(() => import('./app/user.detail.page'));

const AsyncCurrentUser = asyncLoad(() => import('./app/current-user.page'));

const AppPage: React.FC<RouteComponentProps> = () => {
  const user = useCurrentUser();
  const [apollo, setApollo] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    setApollo(createApolloClient(user));
  }, [user]);

  if (!apollo) {
    return <Loading/>
  }

  return (
    <ApolloProvider client={apollo}>
      <AppLayout hasSidebar={user.role !== Roles.User}>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path="/app/me" component={AsyncCurrentUser}/>
            <ProtectedRoute path="/app/clients/:id" resource="client" perm="read:any" component={AsyncClientDetail}/>
            <ProtectedRoute path="/app/clients" resource="client" perm="read:any" component={AsyncClients}/>
            <ProtectedRoute path="/app/users/:id" resource="user" perm="read:any" component={AsyncUserDetail}/>
            <ProtectedRoute path="/app/users" resource="user" perm="read:any" component={AsyncUsers}/>
            <Route path="/app" render={props => {
              if (user.role === Roles.User) {
                return <Redirect to="/app/me"/>
              }
              return <AsyncDashboard {...props}/>
            }}/>
          </Switch>
        </Suspense>
      </AppLayout>
    </ApolloProvider>
  )
}

export default AppPage;
