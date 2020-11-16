import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { light } from './theme/firebase';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={light}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <CssBaseline/>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
