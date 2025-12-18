import type { State } from "../core/state.js";
import { LocationArea } from "../types/LocationArea.js";
export async function commandMap(state: State) {
  try {
    const locations = await state.pokeAPI.fetchLocations(
      state.nextLocationsURL || undefined
    );

    locations.results.forEach((location: LocationArea) => {
      console.log(location.name);
    });

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
  } catch (error) {
    console.log("Error fetching locations:", error);
  }
}

export async function commandMapb(state: State) {
  if (!state.prevLocationsURL) {
    console.log("No previous locations to display.");
    return;
  }

  try {
    const locations = await state.pokeAPI.fetchLocations(
      state.prevLocationsURL || undefined
    );

    locations.results.forEach((location: any) => {
      console.log(location.name);
    });

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
  } catch (error) {
    console.log("Error fetching locations:", error);
  }
}
