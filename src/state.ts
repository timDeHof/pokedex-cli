import { createInterface, type Interface } from "readline";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import { commandMap, commandMapb } from "./command_map.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { PokeAPI } from "./pokeapi.js";
import { Pokemon } from "./pokemon.js";
import { commandInspect } from "./command_inspect.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};
export type State = {
  rl: Interface;
  commands: Record<string, CLICommand>;
  pokeAPI: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
  currentLocation: string | null;
  caughtPokemon: Record<string, Pokemon[]>;
};

export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "pokedex > ",
  });

  const commands: Record<string, CLICommand> = {
    help: {
      name: "help",
      description: "Show all available commands",
      callback: commandHelp,
    },
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    map: {
      name: "map",
      description: "Display 20 location areas",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Display previous 20 location areas",
      callback: commandMapb,
    },
    explore: {
      name: "explore",
      description: "Explore a location area",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Catch a Pokemon",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "inspect a caught pokemon",
      callback: commandInspect,
    },
  };

  const pokeAPI = new PokeAPI();

  return {
    rl,
    commands,
    pokeAPI,
    nextLocationsURL: null,
    prevLocationsURL: null,
    currentLocation: null,
    caughtPokemon: {},
  };
}
