import type { State } from "./state.js";
import type { LocationArea } from "./LocationArea.js";

export async function commandExplore(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("you must provide a location name");
  }

  try {
    const name = args[0];
    const locationData: LocationArea = await state.pokeAPI.fetchLocation(name);

    console.log(`Exploring ${locationData.name}...`);

    if (locationData.pokemon_encounters.length > 0) {
      console.log("\nFound Pokemon:");
      locationData.pokemon_encounters.forEach((encounter) => {
        console.log(`  - ${encounter.pokemon.name}`);
      });
    } else {
      console.log("\nNo Pokemon encounters found in this area.");
    }
  } catch (error) {
    console.log("Error fetching location details:", error);
  }
}
