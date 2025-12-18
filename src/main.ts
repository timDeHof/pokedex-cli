import { startREPL } from "./core/repl.js";
import { initState } from "./core/state.js";

function main() {
  const state = initState();
  startREPL(state);
}

main();
