import type { State } from "./state.js";

// Helper function to normalize Pokémon names for consistent storage
function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function commandCatch(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("you must provide a pokemon name");
  }

  const name = args[0];
  const pokemon = await state.pokeAPI.fetchPokemon(name);

  console.log(`Throwing a Pokeball at ${pokemon.name}...`);

  const res = Math.floor(Math.random() * pokemon.base_experience);
  if (res > 40) {
    console.log(`${pokemon.name} escaped!`);
    return;
  }

  console.log(`${pokemon.name} was caught!`);
  console.log("You may now inspect it with the inspect command.");

  // Store with normalized key for case-insensitive lookups
  const normalizedKey = normalizeName(pokemon.name);

  // Initialize array if it doesn't exist, then push the new pokemon
  if (!state.caughtPokemon[normalizedKey]) {
    state.caughtPokemon[normalizedKey] = [];
  }
  state.caughtPokemon[normalizedKey].push(pokemon);
}
