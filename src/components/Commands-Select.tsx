import { Select } from "@inkjs/ui";
import { Text } from "ink";
import { State } from "../core/state.js";

interface CommandsSelectProps {
  state: State;
  onSelect: (command: string) => void;
}

export default function CommandsSelect({
  state,
  onSelect,
}: CommandsSelectProps) {
  if (!state.commands) {
    return <Text>Loading...</Text>;
  }
  return (
    <Select
      options={Object.values(state.commands).map((command) => ({
        label: command.name,
        value: command.name,
      }))}
      onChange={onSelect}
    />
  );
}
