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
import FavoriteIcon from '@material-ui/icons/Favorite';

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
    },
    pokemonFavoriteButton: {
      margin: theme.spacing(1),
      minWidth: 200,
      height: 56
    },
    pokemonFavoriteButtonWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'center'
    },
    pokemonFavoriteButtonIcon: {
      marginRight: 10
    },
    loadMoreIcon: {
      marginRight: 10
    }
  }),
);

export const Home = (): JSX.Element => {
    const [mount, setMount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [seeFavorites, setSeeFavorites] = useState(true);
    const [pokemonList, setPokemonList] = useState<PokemonList>();
    const [pokemonListResults, setPokemonListResults] = useState<any[]>([]);
    const [pokemonOriginalListResults, setPokemonOriginaListResults] = useState<any[]>([]);
    const [sort, setSort] = React.useState('');
    const [nextRequest, setNextRequest] = useState('');

    const classes = useStyles();

    const fetchData = useCallback(async () => {
      const api = new PokemonApi();
      const result: PokemonList = await api.getPokemons();
      setLoading(false);
      setPokemonList(result);
      setPokemonListResults(result.results);
      setPokemonOriginaListResults(result.results);
      setNextRequest(result.next);
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
          setPokemonListResults(pokemonOriginalListResults);
      }
    };

    const handleSearch = (event: React.ChangeEvent<{ value: unknown }>) => {
      let pokemonsMatched: Array<any> = [];
      const sortedList = _.find(pokemonOriginalListResults, (p) => {
        const typedName = event.target.value as string;
        if(p.name.includes(typedName.toLowerCase())){
          pokemonsMatched.push(p);
        }
      });
      setPokemonListResults(pokemonsMatched);
    };

    const seeFavoritePokemons = (() => {
      if(seeFavorites){
        setSeeFavorites(false);
        if(localStorage.favoritePokemons !== undefined) {
          let favoritePokemons = JSON.parse(localStorage.favoritePokemons);
          let favoritePokemonList: Array<any> = [];
          favoritePokemons.map((pokemon: string) => {
            const pokemonObj = {
              name: pokemon
            };
            favoritePokemonList.push(pokemonObj);
          });
          setPokemonListResults(favoritePokemonList);
        }
      } else {
        setSeeFavorites(true);
        setPokemonListResults(pokemonOriginalListResults);
      }
    });

    let favoriteLabel;

    if(seeFavorites) {
      favoriteLabel = (
        <div className={classes.pokemonFavoriteButtonWrapper}>
          <FavoriteIcon className={classes.pokemonFavoriteButtonIcon}/>
          See My Favorite Pokemons
        </div>
      );
    } else {
      favoriteLabel = (
        <div>
          See all pokemons
        </div>
      );
    }

    const loadMorePokemons = useCallback(async () => {
      const api = new PokemonApi();
      const nameList = nextRequest.split("?");
      const result: PokemonList = await api.getMorePokemons(nameList[1]);
      setPokemonListResults(pokemonListResults.concat(result.results));
      setPokemonOriginaListResults(pokemonOriginalListResults.concat(result.results));
      setNextRequest(result.next);
    }, [pokemonListResults, pokemonOriginalListResults, nextRequest]);

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
            <Button variant="outlined" className={classes.pokemonFavoriteButton} onClick={seeFavoritePokemons}>
              {favoriteLabel}
            </Button>
          </div>
          <Container maxWidth='lg' className={classes.pokemonContainer}>
            {pokemonListResults.map((pokemon) => {
              return (
                <PokemonCard name={pokemon.name} key={pokemon.name}/>
              );
            })}
          </Container>
          {seeFavorites &&
            <div className={classes.loadMoreWrapper}>
              <Button variant="contained" color="primary" onClick={loadMorePokemons}>
                <CachedIcon className={classes.loadMoreIcon}/> Load More Pokemons
              </Button>
            </div>
          }
        </div>
    )
}

export default Home;
