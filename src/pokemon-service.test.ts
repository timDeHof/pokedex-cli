import { describe, it, expect } from "vitest";
import { getPokemon } from "./pokemon-service.js";
import type { Pokemon } from "./pokemon.js";

const mockPokemon: Pokemon = {
  id: 1,
  name: "pikachu",
  height: 4,
  weight: 60,
  base_experience: 112,
  is_default: true,
  order: 1,
  abilities: [],
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: "",
  moves: [],
  species: { name: "pikachu", url: "" },
  sprites: {} as any,
  cries: { latest: "", legacy: "" },
  stats: [
    { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
  ],
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  past_types: [],
  past_abilities: [],
};

describe("getPokemon", () => {
  it("returns pokemon when found with exact name", () => {
    const caughtPokemon = { pikachu: [mockPokemon] };
    const result = getPokemon(caughtPokemon, "pikachu");
    expect(result).toBe(mockPokemon);
  });

  it("returns pokemon when found with different case", () => {
    const caughtPokemon = { pikachu: [mockPokemon] };
    const result = getPokemon(caughtPokemon, "PIKACHU");
    expect(result).toBe(mockPokemon);
  });

  it("returns null when pokemon not found", () => {
    const caughtPokemon = { pikachu: [mockPokemon] };
    const result = getPokemon(caughtPokemon, "charizard");
    expect(result).toBeNull();
  });

  it("returns null when pokemon array is empty", () => {
    const caughtPokemon = { pikachu: [] };
    const result = getPokemon(caughtPokemon, "pikachu");
    expect(result).toBeNull();
  });
});