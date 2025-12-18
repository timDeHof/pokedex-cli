import type { State } from "../core/state.js";

export async function commandExit(state: State, ...args: string[]) {
  console.log("Closing the Pokedex... Goodbye!");
  process.exit(0);
}
