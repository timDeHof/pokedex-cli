import type { State } from "../core/state.js";

export async function commandPokedex(state: State): Promise<void> {
  console.log("Your Pokedex:");
  if (Object.keys(state.caughtPokemon).length === 0) {
    console.log("You have not caught any pokemon yet");
    return;
  }
  for (const pokemonList of Object.values(state.caughtPokemon)) {
    for (const pokemon of pokemonList) {
      console.log(`  - ${pokemon.name}`);
    }
  }
}
``
