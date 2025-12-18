import type { State } from "./state.js";
import { getPokemon } from "./pokemon-service.js";
import { formatPokemonDetails } from "./pokemon-formatter.js";

export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("you must provide a pokemon name");
  }

  const pokemon = getPokemon(state.caughtPokemon, args[0]);
  
  if (!pokemon) {
    console.log("You have not caught that pokemon");
    return;
  }

  console.log(formatPokemonDetails(pokemon));
}
