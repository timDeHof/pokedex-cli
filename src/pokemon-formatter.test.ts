import { describe, it, expect } from "vitest";
import { formatPokemonDetails } from "./pokemon-formatter.js";
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

describe("formatPokemonDetails", () => {
  it("formats pokemon details correctly", () => {
    const result = formatPokemonDetails(mockPokemon);
    const expected = [
      "Name: pikachu",
      "Height: 4",
      "Weight: 60",
      "Stats:",
      "  - hp: 35",
      "  - attack: 55",
      "Types:",
      "  - electric",
    ].join("\n");
    
    expect(result).toBe(expected);
  });
});