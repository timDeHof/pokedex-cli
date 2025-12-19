import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { Select, Spinner } from "@inkjs/ui";
import { LocationArea, PokemonEncounter } from "../../types/LocationArea.js";
import { PokeAPI } from "../../services/pokeapi.js";
import ScreenContainer from "../Container-screen.js";

interface ScreenProps {
  onExplore: (locationId: number | string) => void;
  onBack: () => void;
  nextURL?: string | null;
  prevURL?: string | null;
}

function MapScreen({ onExplore, onBack, nextURL, prevURL }: ScreenProps) {
  const [locationAreas, setLocationAreas] = useState<LocationArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [currentNextURL, setCurrentNextURL] = useState<string | null>(
    nextURL || null
  );
  const [currentPrevURL, setCurrentPrevURL] = useState<string | null>(
    prevURL || null
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationArea | null>(
    null
  );
  const [pokemonEncounters, setPokemonEncounters] = useState<
    PokemonEncounter[]
  >([]);
  const [loadingEncounters, setLoadingEncounters] = useState(false);
  const [pokeAPI] = useState(() => new PokeAPI());
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchLocationAreas();
  }, [page]);

  useEffect(() => {
    // Add event listener for keyboard input
    process.stdin.on("data", (data) => {
      const key = data.toString();
      if (key === "\u001b") {
        // ESC key
        onBack();
      } else if (key === "p" || key === "P") {
        // 'p' key for previous page
        if (currentPrevURL) {
          handlePreviousPage();
        }
      } else if (key === "n" || key === "N") {
        // 'n' key for next page
        if (currentNextURL) {
          handleNextPage();
        }
      }
    });

    return () => {
      // Cleanup would go here if needed
    };
  }, [onBack, currentPrevURL, currentNextURL]);

  const fetchLocationAreas = async (url?: string | null) => {
    setLoading(true);
    try {
      const data = await pokeAPI.fetchLocations(url || undefined);
      setLocationAreas(data.results);
      setCurrentNextURL(data.next);
      setCurrentPrevURL(data.previous);
    } catch (error) {
      console.error("Error fetching location areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonEncounters = async (locationAreaName: string) => {
    setLoadingEncounters(true);
    try {
      const locationData = await pokeAPI.fetchLocation(locationAreaName);
      setSelectedLocation(locationData);
      setPokemonEncounters(locationData.pokemon_encounters || []);
    } catch (error) {
      console.error("Error fetching Pokemon encounters:", error);
    } finally {
      setLoadingEncounters(false);
    }
  };

  const handleLocationSelect = (value: string) => {
    // Find the selected area by name (since we now always use names as values)
    const selectedArea = locationAreas.find((area) => area.name === value);

    if (selectedArea) {
      fetchPokemonEncounters(selectedArea.name);
      // Call the explore callback with the location name
      onExplore(selectedArea.name);
    }
  };

  const handlePreviousPage = () => {
    if (currentPrevURL) {
      setPage((prev) => prev - 1);
      fetchLocationAreas(currentPrevURL);
    }
  };

  const handleNextPage = () => {
    if (currentNextURL) {
      setPage((prev) => prev + 1);
      fetchLocationAreas(currentNextURL);
    }
  };

  if (loading) {
    return (
      <Box justifyContent="center" padding={2}>
        <Text color="yellow">
          Loading locations {(page || 0) * PAGE_SIZE + 1}-
          {(page + 1) * PAGE_SIZE}...
        </Text>
      </Box>
    );
  }

  // Navigation buttons component
  const NavigationButtons = () => (
    <Box flexDirection="row" justifyContent="center" gap={1} width="100%">
      {/* Previous button */}
      <Box
        borderStyle="round"
        borderColor={currentPrevURL ? "yellow" : "grey"}
        backgroundColor={currentPrevURL ? "yellow" : "grey"}
        paddingY={1}
        paddingX={2}
      >
        <Text dimColor={!currentPrevURL} inverse>
          ← Previous Areas [P]
        </Text>
      </Box>

      {/* Action button */}
      <Box
        borderStyle="round"
        borderColor="green"
        backgroundColor="green"
        paddingY={1}
        paddingX={2}
      >
        <Text color="green" inverse>
          🎯 Explore Area [Enter]
        </Text>
      </Box>

      {/* Next button */}
      <Box
        borderStyle="round"
        borderColor={currentNextURL ? "yellow" : "grey"}
        backgroundColor={currentNextURL ? "yellow" : "grey"}
        paddingY={1}
        paddingX={2}
      >
        <Text
          color={currentNextURL ? "yellow" : "grey"}
          dimColor={!currentNextURL}
          inverse
        >
          Next Areas [N] →
        </Text>
      </Box>
    </Box>
  );

  const mapContent = (
    <Box flexDirection="column" flexGrow={1} gap={1}>
      <NavigationButtons />

      {/* Two-column layout */}
      <Box flexGrow={1} flexDirection="row">
        {/* Left side - Location areas */}
        <Box
          width="50%"
          marginRight={1}
          borderStyle="single"
          padding={1}
          flexDirection="column"
        >
          <Box flexDirection="column" marginBottom={1}>
            <Text bold color="blue">
              Locations
            </Text>
          </Box>
          <Select
            options={locationAreas.map((area, index) => ({
              label: area.name.replace(/-/g, " "),
              value: index.toString(), // Use index as unique value
            }))}
            onChange={(value) => {
              // Get the area by index
              const index = parseInt(value);
              const selectedArea = locationAreas[index];
              if (selectedArea) {
                handleLocationSelect(selectedArea.name);
              }
            }}
          />
        </Box>

        {/* Right side - Pokemon encounters */}
        <Box width="50%" borderStyle="single" padding={1}>
          <Box marginBottom={1}>
            <Text bold color="green">
              Pokemon Encounters
            </Text>
          </Box>

          {loadingEncounters && <Spinner label="Loading encounters..." />}

          {!loadingEncounters && selectedLocation && (
            <Box flexDirection="column">
              <Box marginBottom={1}>
                <Text dimColor>{selectedLocation.name.replace(/-/g, " ")}</Text>
              </Box>

              {pokemonEncounters.length > 0 ? (
                <Box flexDirection="column">
                  {pokemonEncounters.slice(0, 15).map((encounter, index) => (
                    <Box
                      key={`${selectedLocation.id}-${encounter.pokemon.name}-${index}`}
                      marginBottom={1}
                    >
                      <Text color="cyan">
                        • {encounter.pokemon.name.replace(/-/g, " ")}
                      </Text>
                      {encounter.version_details.length > 0 && (
                        <Text dimColor>
                          {" "}
                          (Lvl{" "}
                          {encounter.version_details[0].encounter_details[0]
                            ?.min_level || 0}
                          -
                          {encounter.version_details[0].encounter_details[0]
                            ?.max_level || 0}
                          )
                        </Text>
                      )}
                    </Box>
                  ))}
                  {pokemonEncounters.length > 15 && (
                    <Text dimColor>
                      ... and {pokemonEncounters.length - 15} more Pokemon
                    </Text>
                  )}
                </Box>
              ) : (
                <Text dimColor>No Pokemon encounters found</Text>
              )}
            </Box>
          )}

          {!loadingEncounters && !selectedLocation && (
            <Text dimColor>Select a location to see Pokemon encounters</Text>
          )}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>
          Press <Text color="yellow">[ESC]</Text> to go back to commands, or{" "}
          <Text color="red">Ctrl+C</Text> to exit
        </Text>
      </Box>
    </Box>
  );

  return (
    <ScreenContainer title="🗺️ Location Areas" pageNumber={page}>
      {mapContent}
    </ScreenContainer>
  );
}

export default MapScreen;
