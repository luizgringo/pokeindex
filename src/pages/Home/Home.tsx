import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { PokemonCard } from '../../components/PokemonCard/PokemonCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginTop: '50px'
    },
  }),
);

export const Home = (): JSX.Element => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
          <Container maxWidth="md">
            <h1>this is the home page</h1>
            <PokemonCard />
          </Container>
        </div>
    )
}

export default Home;
