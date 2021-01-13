import React from 'react'
import {RouteComponentProps} from "@reach/router"

interface PokemonProps extends RouteComponentProps
{
  pokemonId?: string;
}

export const Pokemon = (props : PokemonProps) : JSX.Element => {
  return (
    <h1>this is the Pokemon page: {props.pokemonId}</h1>
  )
}

export default Pokemon;
