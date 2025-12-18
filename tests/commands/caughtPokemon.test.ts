import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { initState } from "../../src/core/state.js";
import { commandCatch } from "../../src/commands/command_catch.js";
import { commandInspect } from "../../src/commands/command_inspect.js";
import { Pokemon } from "../../src/types/pokemon.js";

// Mock Pokemon data for testing
const createMockPokemon = (name: string): Pokemon => ({
  id: 1,
  name,
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
  species: { name, url: "" },
  sprites: {
    back_default: "",
    back_female: null,
    back_shiny: "",
    back_shiny_female: null,
    front_default: "",
    front_female: null,
    front_shiny: "",
    front_shiny_female: null,
  },
  cries: {
    latest: "",
    legacy: "",
  },
  stats: [
    { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
  ],
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  past_types: [],
  past_abilities: [],
});

const mockPokemon1 = createMockPokemon("Pikachu");
const mockPokemon2 = createMockPokemon("PIKACHU"); // Different case

const createMockCharizard = (): Pokemon => ({
  id: 6,
  name: "Charizard",
  height: 17,
  weight: 905,
  base_experience: 240,
  is_default: true,
  order: 6,
  abilities: [],
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: "",
  moves: [],
  species: { name: "charizard", url: "" },
  sprites: {
    back_default: "",
    back_female: null,
    back_shiny: "",
    back_shiny_female: null,
    front_default: "",
    front_female: null,
    front_shiny: "",
    front_shiny_female: null,
  },
  cries: {
    latest: "",
    legacy: "",
  },
  stats: [
    { base_stat: 78, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 84, effort: 0, stat: { name: "attack", url: "" } },
  ],
  types: [
    { slot: 1, type: { name: "fire", url: "" } },
    { slot: 2, type: { name: "flying", url: "" } },
  ],
  past_types: [],
  past_abilities: [],
});

const mockPokemon3 = createMockCharizard();

describe("caughtPokemon Array Functionality", () => {
  let state: ReturnType<typeof initState>;

  beforeEach(() => {
    state = initState();

    // Mock the pokeAPI.fetchPokemon method
    state.pokeAPI.fetchPokemon = async (name: string) => {
      if (name.toLowerCase().includes("pikachu")) {
        return name === "PIKACHU" ? mockPokemon2 : mockPokemon1;
      }
      if (name.toLowerCase().includes("charizard")) {
        return mockPokemon3;
      }
      throw new Error(`Pokemon ${name} not found`);
    };

    // Mock Math.random to ensure Pokemon are always caught
    const originalRandom = Math.random;
    Math.random = () => 0.1; // Always return low value to ensure catch success
  });

  afterEach(() => {
    // Restore original Math.random
    Math.random = (Math as any).random;
  });

  describe("Basic Array Operations", () => {
    test("should store single pokemon in array", async () => {
      await commandCatch(state, "Pikachu");

      expect(state.caughtPokemon["pikachu"]).toBeDefined();
      expect(state.caughtPokemon["pikachu"]).toHaveLength(1);
      expect(state.caughtPokemon["pikachu"][0].name).toBe("Pikachu");
    });

    test("should handle case-insensitive storage with normalizeName", async () => {
      await commandCatch(state, "PIKACHU");

      expect(state.caughtPokemon["pikachu"]).toBeDefined();
      expect(state.caughtPokemon["pikachu"]).toHaveLength(1);
      expect(state.caughtPokemon["pikachu"][0].name).toBe("PIKACHU");
    });

    test("should add multiple pokemon to same array for same normalized name", async () => {
      await commandCatch(state, "Pikachu");
      await commandCatch(state, "PIKACHU"); // Different case, same pokemon

      expect(state.caughtPokemon["pikachu"]).toBeDefined();
      expect(state.caughtPokemon["pikachu"]).toHaveLength(2);
      expect(state.caughtPokemon["pikachu"][0].name).toBe("Pikachu");
      expect(state.caughtPokemon["pikachu"][1].name).toBe("PIKACHU");
    });

    test("should store different pokemon in separate arrays", async () => {
      await commandCatch(state, "Pikachu");
      await commandCatch(state, "Charizard");

      expect(Object.keys(state.caughtPokemon)).toHaveLength(2);
      expect(state.caughtPokemon["pikachu"]).toHaveLength(1);
      expect(state.caughtPokemon["charizard"]).toHaveLength(1);
    });
  });

  describe("Duplicate Handling", () => {
    test("should allow duplicate pokemon in array", async () => {
      await commandCatch(state, "Pikachu");
      await commandCatch(state, "Pikachu");

      expect(state.caughtPokemon["pikachu"]).toHaveLength(2);
      expect(state.caughtPokemon["pikachu"][0].name).toBe("Pikachu");
      expect(state.caughtPokemon["pikachu"][1].name).toBe("Pikachu");
    });

    test("should handle mixed case duplicates", async () => {
      await commandCatch(state, "pikachu");
      await commandCatch(state, "PIKACHU");
      await commandCatch(state, "PiKaChU");

      expect(state.caughtPokemon["pikachu"]).toHaveLength(3);
      expect(state.caughtPokemon["pikachu"][0].name).toBe("Pikachu");
      expect(state.caughtPokemon["pikachu"][1].name).toBe("PIKACHU");
      expect(state.caughtPokemon["pikachu"][2].name).toBe("Pikachu");
    });
  });

  describe("Inspect Command Array Handling", () => {
    let mockConsoleOutput: string[];
    let originalLog: (...args: any[]) => void;

    beforeEach(() => {
      mockConsoleOutput = [];

      // Mock console.log to capture output
      originalLog = console.log;
      console.log = (...args: any[]) => {
        mockConsoleOutput.push(args.join(" "));
        originalLog(...args);
      };
    });

    afterEach(() => {
      console.log = originalLog;
    });

    test("should inspect first pokemon from array when multiple exist", async () => {
      await commandCatch(state, "Pikachu");
      await commandCatch(state, "PIKACHU");

      await commandInspect(state, "pikachu");

      const output = mockConsoleOutput.join(" ");
      expect(output).toContain("Name: pikachu"); // First one
    });

    test("should handle inspect for single pokemon in array", async () => {
      await commandCatch(state, "Charizard");

      await commandInspect(state, "charizard");

      const output = mockConsoleOutput.join(" ");
      expect(output).toContain("Name: charizard");
      expect(output).toContain("Height: 17");
      expect(output).toContain("Weight: 905");
      expect(output).toContain("Stats:");
      expect(output).toContain("Types:");
    });

    test("should show error for non-existent pokemon", async () => {
      await commandInspect(state, "nonexistent");

      expect(mockConsoleOutput).toContain("You have not caught that pokemon");
    });

    test("should handle inspect with different case", async () => {
      await commandCatch(state, "Pikachu");

      await commandInspect(state, "PIKACHU");

      const output = mockConsoleOutput.join(" ");
      expect(output).toContain("Name: pikachu");
    });
  });

  describe("Edge Cases", () => {
    let mockConsoleOutput: string[];
    let originalLog: (...args: any[]) => void;

    beforeEach(() => {
      mockConsoleOutput = [];

      // Mock console.log to capture output
      originalLog = console.log;
      console.log = (...args: any[]) => {
        mockConsoleOutput.push(args.join(" "));
        originalLog(...args);
      };
    });

    afterEach(() => {
      console.log = originalLog;
    });

    test("should handle pokemon names with leading/trailing spaces", async () => {
      await commandCatch(state, "  Pikachu  ");

      expect(state.caughtPokemon["pikachu"]).toBeDefined();
      expect(state.caughtPokemon["pikachu"]).toHaveLength(1);
    });

    test("should handle empty state inspection", async () => {
      await commandInspect(state, "Pikachu");

      expect(mockConsoleOutput).toContain("You have not caught that pokemon");
    });

    test("should maintain separate arrays for different normalized names", async () => {
      await commandCatch(state, "Pikachu");
      await commandCatch(state, "Charizard");
      await commandCatch(state, "pikachu"); // Another pikachu

      expect(Object.keys(state.caughtPokemon)).toHaveLength(2);
      expect(state.caughtPokemon["pikachu"]).toHaveLength(2);
      expect(state.caughtPokemon["charizard"]).toHaveLength(1);
    });
  });
});
