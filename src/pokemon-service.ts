import type { Pokemon } from "./pokemon.js";
import { normalizeName } from "./utils.js";

export function getPokemon(
  caughtPokemon: Record<string, Pokemon[]>,
  name: string
): Pokemon | null {
  const normalizedName = normalizeName(name);
  const pokemonArray = caughtPokemon[normalizedName];
  return pokemonArray?.[0] ?? null;
}
