import type { State } from "./state.js";

// Helper function to normalize Pokémon names for case-insensitive lookups
function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("you must provide a pokemon name");
  }

  const name = args[0];
  const normalizedName = normalizeName(name);

  // Direct lookup using normalized key (since storage now uses normalized keys)
  const caught_pokemon_array = state.caughtPokemon[normalizedName];

  if (!caught_pokemon_array || caught_pokemon_array.length === 0) {
    console.log("You have not caught that pokemon");
    return;
  }

  // Get the first pokemon from the array (could also get the most recent)
  const caught_pokemon = caught_pokemon_array[0];

  console.log(`Name: ${caught_pokemon.name}`);
  console.log(`Height: ${caught_pokemon.height}`);
  console.log(`Weight: ${caught_pokemon.weight}`);
  console.log("Stats:");
  for (const stat of caught_pokemon.stats) {
    console.log(`  - ${stat.stat.name}: ${stat.base_stat}`);
  }
  console.log("Types:");
  for (const typeInfo of caught_pokemon.types) {
    console.log("  - ", typeInfo.type.name);
  }
}
