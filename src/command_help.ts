import type { State } from "./state.js";

export async function commandHelp(state: State, ...args: string[]) {
  const { commands } = state;

  console.log("Welcome to the Pokedex! Here are the available commands:");
  console.log("");

  for (const [name, command] of Object.entries(commands)) {
    console.log(`${name}: ${command.description}`);
  }
}
