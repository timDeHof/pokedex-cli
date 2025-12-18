import { describe, expect, test, vi } from "vitest";
import { commandPokedex } from "./command_pokedex.js";
import type { State } from "./state.js";

describe("commandPokedex", () => {
  test("displays message when no pokemon caught", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const mockState = {
      caughtPokemon: {}
    } as State;

    await commandPokedex(mockState);

    expect(consoleSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleSpy).toHaveBeenCalledWith("You have not caught any pokemon yet");
  });

  test("displays caught pokemon", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const mockState = {
      caughtPokemon: {
        "location1": [{ name: "pikachu" }, { name: "charmander" }],
        "location2": [{ name: "squirtle" }]
      }
    } as State;

    await commandPokedex(mockState);

    expect(consoleSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleSpy).toHaveBeenCalledWith("  - pikachu");
    expect(consoleSpy).toHaveBeenCalledWith("  - charmander");
    expect(consoleSpy).toHaveBeenCalledWith("  - squirtle");
  });
});