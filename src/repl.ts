import type { State } from "./state.js";

export function startREPL(state: State) {
  state.rl.prompt()
  state.rl.on("line", async (input) => {
    const words = cleanInput(input)
    if (words.length === 0) {
      state.rl.prompt()
      return
    }

    const commandName = words[0];
    const command = state.commands[commandName];
    if (command) {
      await command.callback(state);
    } else {
      console.log(`Unknown command: ${commandName}`);
    }
    state.rl.prompt()
  })
}




export function cleanInput(input: string): string[] {
  const words = input.split(" ")
  return words.map((word) => word.toLowerCase().trim()).filter((word) => word !== "")
}
