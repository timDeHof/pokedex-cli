import type { Pokemon } from "./pokemon.js";
import { normalizeName } from "./utils.js";

export function formatPokemonDetails(pokemon: Pokemon): string {
  const lines = [
    `Name: ${normalizeName(pokemon.name)}`,
    `Height: ${pokemon.height}`,
    `Weight: ${pokemon.weight}`,
    "Stats:",
    ...pokemon.stats.map((stat) => `  - ${stat.stat.name}: ${stat.base_stat}`),
    "Types:",
    ...pokemon.types.map((typeInfo) => `  - ${typeInfo.type.name}`),
  ];
  return lines.join("\n");
}
