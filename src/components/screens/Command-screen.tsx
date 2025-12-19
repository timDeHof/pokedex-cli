import React from "react";
import { Text, Box } from "ink";
import type { State } from "@/core/state.js";
import MapScreen from "./Map-screen.js";

interface CommandScreenProps {
  command: string;
  state: State;
  onBack?: () => void;
  onExit?: () => void;
}

export default function CommandScreen({
  command,
  state,
  onBack,
  onExit,
}: CommandScreenProps) {
  switch (command) {
    case "help":
      return (
        <Box flexDirection="column">
          <Text>Available commands:</Text>
          {Object.values(state.commands).map((cmd) => (
            <Text key={cmd.name}>
              • {cmd.name}: {cmd.description}
            </Text>
          ))}
        </Box>
      );
    case "map":
      return (
        <MapScreen
          onExplore={(locationId) =>
            console.log(`Exploring location ${locationId}`)
          }
          onBack={onBack || (() => console.log("Back pressed"))}
          nextURL={state.nextLocationsURL}
          prevURL={state.prevLocationsURL}
        />
      );
    case "pokedex":
      return (
        <Box flexDirection="column">
          <Text>Your Pokédex:</Text>
          {Object.keys(state.caughtPokemon).length === 0 ? (
            <Text>No Pokémon caught yet</Text>
          ) : (
            Object.values(state.caughtPokemon)
              .flat()
              .map((pokemon, i) => <Text key={i}>• {pokemon.name}</Text>)
          )}
        </Box>
      );
    case "exit":
      if (onExit) {
        onExit();
      }
      return (
        <Text>Goodbye! Use Ctrl+C to exit or press any key to continue.</Text>
      );
    default:
      return <Text>Select a command from the menu</Text>;
  }
}
