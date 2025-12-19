import { useState } from "react";
import { initState } from "../core/state.js";
import type { State } from "../core/state.js";
import ContainerElement from "./Container-Element.js";
import CommandsSelect from "./Commands-Select.js";
import CommandScreen from "./screens/Command-screen.js";

export default function App() {
  const [state] = useState<State>(() => initState());
  const [selectedCommand, setSelectedCommand] = useState<string>("");

  const handleCommandSelect = (command: string) => {
    setSelectedCommand(command);
  };

  const handleBackToCommands = () => {
    setSelectedCommand("");
  };

  const handleExit = () => {
    process.exit(0);
  };

  return (
    <ContainerElement>
      {selectedCommand ? (
        // When a command is selected, show the command screen
        <CommandScreen
          command={selectedCommand}
          state={state}
          onBack={handleBackToCommands}
          onExit={handleExit}
        />
      ) : (
        // When no command is selected, show command selection
        <CommandsSelect state={state} onSelect={handleCommandSelect} />
      )}
    </ContainerElement>
  );
}
