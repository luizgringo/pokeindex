import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import { PokemonCard } from '../../components/PokemonCard/PokemonCard'

import PokemonApi from '../../api/PokemonApi';
import { PokemonList } from '../../models/PokemonList';

import _ from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block'
    },
    pokemonContainer: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignContent: 'space-between',
      flexWrap: 'wrap'
    },
    loadMoreWrapper: {
      textAlign: 'center',
      margin: '30px',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    search: {
      margin: theme.spacing(1),
      minWidth: '230px'
    },
    filterOptions: {
      textAlign: 'center',
      marginTop: '90px',
    }
  }),
);

export const Home = (): JSX.Element => {
    const [mount, setMount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pokemonList, setPokemonList] = useState<PokemonList>();
    const [pokemonListResults, setPokemonListResults] = useState<any[]>([]);
    const [sort, setSort] = React.useState('');

    const classes = useStyles();

    const fetchData = useCallback(async () => {
      const api = new PokemonApi();
      const result: PokemonList = await api.getPokemons();
      setLoading(false);
      setPokemonList(result);
      setPokemonListResults(result.results);
    }, []);

    useEffect(() => {
      if(!mount) {
        setMount(true);
        setLoading(true);
        fetchData();
      }
    },[fetchData, loading, mount]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSort(event.target.value as string);

      const sortedList = _.sortBy(pokemonListResults, ['name']);

      switch(event.target.value) {
        case 'nameAsc':
          setPokemonListResults(sortedList);
          break;
        case 'nameDesc':
          setPokemonListResults(sortedList.reverse());
          break;
        default:
          const originalResults = pokemonList !== undefined ? pokemonList.results : [];
          setPokemonListResults(originalResults);
      }
    };

    const handleSearch = (event: React.ChangeEvent<{ value: unknown }>) => {
      let pokemonsMatched: Array<any> = [];
      const originalResults = pokemonList !== undefined ? pokemonList.results : [];
      const sortedList = _.find(originalResults, (p) => {
        const typedName = event.target.value as string;
        if(p.name.includes(typedName.toLowerCase())){
          pokemonsMatched.push(p);
        }
      });
      setPokemonListResults(pokemonsMatched);
    };

    return (
        <div className={classes.root}>
          <div className={classes.filterOptions}>
            <TextField className={classes.search} onChange={handleSearch} id="outlined-search" label="Find pokemon by the name" type="search" variant="outlined" />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={sort}
                onChange={handleChange}
                label="Sort"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value='nameAsc'>Name: A - Z</MenuItem>
                <MenuItem value='nameDesc'>Name: Z - A</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Container maxWidth='lg' className={classes.pokemonContainer}>
            {pokemonListResults.map((pokemon) => {
              return (
                <PokemonCard name={pokemon.name} key={pokemon.name}/>
              );
            })}
          </Container>
          <div className={classes.loadMoreWrapper}>
            <Button variant="contained" color="primary">
              <CachedIcon /> Load More Pokemons
            </Button>
          </div>
        </div>
    )
}

export default Home;
