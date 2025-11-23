import type { State } from "./state.js";

export async function commandMap(state: State) {
  try {
    const data = await state.pokeAPI.fetchLocations(
      state.nextLocationsURL || undefined
    );

    data.results.forEach((location) => {
      console.log(location.name);
    });

    state.nextLocationsURL = data.next;
    state.prevLocationsURL = data.previous;
    // Set current location to the first location for exploration
    state.currentLocation =
      data.results.length > 0 ? data.results[0].name : null;
  } catch (error) {
    console.log("Error fetching locations:", error);
  }
}

export async function commandMapb(state: State) {
  if (!state.prevLocationsURL) {
    console.log("You're on the first page!");
    return;
  }

  try {
    const data = await state.pokeAPI.fetchLocations(state.prevLocationsURL);

    data.results.forEach((location) => {
      console.log(location.name);
    });

    state.nextLocationsURL = data.next;
    state.prevLocationsURL = data.previous;
  } catch (error) {
    console.log("Error fetching locations:", error);
  }
}
