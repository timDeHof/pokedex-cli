import { LocationArea } from "../types/LocationArea.js";
import { Cache } from "./pokecache.js";
import { Pokemon } from "../types/pokemon.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    this.cache = new Cache(); // Default 5-second cache
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    // Check cache first
    const cachedData = this.cache.get<ShallowLocations>(url);
    if (cachedData) {
      return cachedData;
    }

    // If not cached, make the request
    const response = await fetch(url);
    const data = await response.json();

    // Add to cache
    this.cache.add(url, data);

    return data;
  }

  async fetchLocation(locationName: string): Promise<LocationArea> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    // Check cache first
    const cachedData = this.cache.get<LocationArea>(url);
    if (cachedData) {
      return cachedData;
    }

    // If not cached, make the request
    const response = await fetch(url);
    const data = await response.json();

    // Add to cache
    this.cache.add(url, data);

    return data;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;

    // Check cache first
    const cachedData = this.cache.get<Pokemon>(url);
    if (cachedData) {
      return cachedData;
    }
    try {
      // If not cached, make the request
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const pokemon: Pokemon = await response.json();

      // Add to cache
      this.cache.add(url, pokemon);

      return pokemon;
    } catch (e) {
      throw new Error(
        `Error fetching pokemon '${pokemonName}': ${(e as Error).message}`
      );
    }
  }
}

export type ShallowLocations = {
  results: LocationArea[];
  next: string | null;
  previous: string | null;
};
