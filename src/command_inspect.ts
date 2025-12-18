import type { State } from "./state.js";

export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("you must provide a pokemon name");
  }

  const name = args[0];
  const caught_pokemon = state.caughtPokemon[name];

  if (!caught_pokemon) {
    console.log("You have not caught that pokemon");
    return;
  }

  console.log(`Name: ${caught_pokemon.name}`);
  console.log(`Height: ${caught_pokemon.height}`);
  console.log(`Weight: ${caught_pokemon.weight}`);
  console.log("Stats:");
  for (const stat of caught_pokemon.stats) {
    console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
  }
  console.log("Types:");
  for (const typeInfo of caught_pokemon.types) {
    console.log("  -", typeInfo.type.name);
  }
}
