import React from 'react';
import { Router, RouteComponentProps } from "@reach/router";

import { Home } from './pages/Home/Home'
import { Pokemon } from './pages/Pokemon/Pokemon'

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';

import AppBar from './layout/AppBar/AppBar'

const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppBar />
      <Router>
        <RouterPage path="/" pageComponent={<Home />} />
        <RouterPage path="/pokemon/:pokemonId" pageComponent={<Pokemon />} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
