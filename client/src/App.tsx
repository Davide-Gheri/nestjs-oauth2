import React, { Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';
import { history } from './history';
import HomePage from './pages/home.page';
import { client } from './client';
import { GuestRoute } from './components/routes';
import { asyncLoad } from './utils';
import { Loading } from './components/loading';

const AsyncLogin = asyncLoad(() => import('./pages/login.page'));
const AsyncRegister = asyncLoad(() => import('./pages/register.page'));
const AsyncAuthorize = asyncLoad(() => import('./pages/authorize.page'));
const AsyncApp = asyncLoad(() => import('./pages/app.page'));

export const App: React.FC = () => {
  return (
    <ClientContextProvider client={client}>
      <Router history={history}>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <GuestRoute path="/auth/login" component={AsyncLogin}/>
            <GuestRoute path="/auth/register" component={AsyncRegister}/>
            <Route path="/oauth2/authorize" component={AsyncAuthorize}/>
            <Route path="/app" component={AsyncApp}/>
            <Route path="/" component={HomePage}/>
          </Switch>
        </Suspense>
      </Router>
    </ClientContextProvider>
  );
}
