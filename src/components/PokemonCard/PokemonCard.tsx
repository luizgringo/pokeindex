import React, { useEffect, useState, useCallback } from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grow from '@material-ui/core/Grow';

import PokemonApi from '../../api/PokemonApi';
import { Pokemon } from '../../models/Pokemon';

import { Loader } from '../../components/Loader/Loader';

import _ from 'lodash';

type PokemonDataProps = {
  name: string;
};

const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
        maxWidth: 345,
        margin: '20px'
    },
    headerCard: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    pokemonId: {
        margin: '12px'
    },
    hp: {
      marginTop: '12px',
      marginRight: '12px'
    },
    pokemonCardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    pokemonCardName: {
      fontWeight: 'bold'
    },
    spanBold: {
      fontWeight: 'bold'
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    cardActions: {
      justifyContent: 'center'
    },
}));

export const PokemonCard = (props: PokemonDataProps) : JSX.Element => {
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon>();

  const classes = useStyles();

  const fetchData = useCallback(async () => {
    const api = new PokemonApi();
    const result: Pokemon = await api.getPokemon(props.name);
    setLoading(false);
    setPokemon(result);
    if(localStorage.favoritePokemons !== undefined && localStorage.favoritePokemons.includes(result.name)) {
      setIsFavorite(true);
    }
  }, [props.name]);

  useEffect(() => {
    if(!mount) {
      setMount(true);
      setLoading(true);
      fetchData();
    }
  },[fetchData, loading, mount]);

  const addToFavoritePokemons = (() => {
    const pokemonName = (pokemon !== undefined ? pokemon.name : '');
    if(!isFavorite) {
      if(localStorage.favoritePokemons === undefined) {
        let favoritePokemons = [];
        favoritePokemons[0] = pokemonName;
        localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
      } else if(!localStorage.favoritePokemons.includes(pokemonName)){
        let favoritePokemons = JSON.parse(localStorage.favoritePokemons);
        favoritePokemons.push(pokemonName);
        localStorage.setItem("favoritePokemons", "");
        localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
      }
      setIsFavorite(true);
    } else{
      if(localStorage.favoritePokemons !== undefined) {
        let favoritePokemons = JSON.parse(localStorage.favoritePokemons);
        let evens = _.remove(favoritePokemons, (p) => {
          if(p === pokemonName){
            return p;
          }
        });
        localStorage.setItem("favoritePokemons", "");
        localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
      }
      setIsFavorite(false);
    }
  });

  if (loading) {
    return <Loader />
  } else {
      return (
        <Grow in={!loading}>
          <Card className={classes.root}>
              <CardActionArea>
                  <div className={classes.headerCard}>
                      <IconButton aria-label="add to favorites" onClick={addToFavoritePokemons}>
                      { isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon /> }
                      </IconButton>
                      <div>
                        <Chip label={`HP: ${pokemon !== undefined ? pokemon.stats[0].base_stat : ''}`} color="secondary" className={classes.hp}/>
                        <Chip label={`Base Exp.: ${pokemon !== undefined ? pokemon.base_experience : ''}`} color="primary" className={classes.hp}/>
                      </div>
                  </div>
                  <CardMedia
                      component="img"
                      alt={pokemon !== undefined ? _.startCase(pokemon.name) : ''}
                      width="140"
                      height="320"
                      image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon !== undefined ? pokemon.id : ''}.png`}
                      title={pokemon !== undefined ? _.startCase(pokemon.name) : ''} />
                  <CardContent>
                      <div className={classes.pokemonCardHeader}>
                        <Typography className={classes.pokemonCardName} gutterBottom variant="h4" component="h2">
                          {pokemon !== undefined ? _.startCase(pokemon.name) : ''}
                        </Typography>
                        <div>
                          <div><span className={classes.spanBold}>Height:</span> {pokemon !== undefined ? pokemon.height / 10 : ''} m</div>
                          <div><span className={classes.spanBold}>Weight:</span> {pokemon !== undefined ? pokemon.weight / 10 : ''} kg</div>
                        </div>
                      </div>
                      <div>
                        <div>
                        <span className={classes.spanBold}>Abilities:</span>
                        {pokemon !== undefined ? pokemon.abilities.map((ability) => {
                            return (
                              <li key={ability.ability.name}>{_.startCase(ability.ability.name)}</li>
                            );
                          }) : ''}
                        </div>
                      </div>
                  </CardContent>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
                {pokemon !== undefined ? pokemon.types.map((type) => {
                    return (
                      <Chip label={_.startCase(type.type.name)} className={classes.chip} clickable/>
                    );
                }): ''}
              </CardActions>
          </Card>
        </Grow>
      );
    }
}

export default PokemonCard;
