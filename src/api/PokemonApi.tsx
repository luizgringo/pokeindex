import HttpClient from './HttpClientInterceptor';
import { Pokemon } from '../models/Pokemon';
import { PokemonList } from '../models/PokemonList';

export default class PokemonApi extends HttpClient {
  public constructor() {
    super('https://pokeapi.co/api/v2/');
  }

  public getPokemons = async () => this.instance.get<PokemonList>('/pokemon').then(response => {
    const result = response as unknown;
    return result as PokemonList;
  });

  public getPokemon = async (name: String) => this.instance.get<Pokemon>(`/pokemon/${name}`).then(response => {
    const result = response as unknown;
    return result as Pokemon;
  });;

}
