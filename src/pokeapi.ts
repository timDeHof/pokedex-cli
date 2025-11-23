import { LocationArea } from "./LocationArea.js";
import { Cache } from "./pokecache.js";

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
}

export type ShallowLocations = {
  results: LocationArea[];
  next: string | null;
  previous: string | null;
};
