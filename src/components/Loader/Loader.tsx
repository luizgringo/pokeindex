import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingGif: {
      margin: '2em',
      width: '110px'
    }
  }),
);

export const Loader = (): JSX.Element => {
  const classes = useStyles();

  return (
    <img
    className={classes.loadingGif}
    src={process.env.PUBLIC_URL + '/images/loading.gif'}
    alt="Pokémon Logo" />
  )
}

export default Loader;
