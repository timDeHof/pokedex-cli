import type { State } from "./state.js";

export async function commandHelp(state: State) {
  const { commands } = state;
  console.log("Welcome to the Pokedex!");
  console.log("Usage:");
  console.log("");

  Object.values(commands).forEach(command => {
    console.log(`${command.name}: ${command.description}`);
  });
}
