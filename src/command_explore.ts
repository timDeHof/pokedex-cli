import type { State } from "./state.js";
import type { LocationArea } from "./LocationArea.js";

export async function commandExplore(state: State): Promise<void> {
  if (!state.currentLocation) {
    console.log(
      "No location selected. Use the 'map' command to view locations."
    );
    return;
  }

  try {
    const locationData: LocationArea = await state.pokeAPI.fetchLocation(
      state.currentLocation
    );

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
