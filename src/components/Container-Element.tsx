import { Box, Text } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
import React from "react";

export default function ContainerElement({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box flexDirection="column" height="100%" borderStyle="single" padding={1}>
      {/* Always show the Pokedex Big Text at the top */}
      <Box marginBottom={1}>
        <Gradient name="cristal">
          <BigText text="Pokedex" />
        </Gradient>
      </Box>
      <Box flexDirection="column" gap={5} flexGrow={1}>
        <Box justifyContent="center" flexDirection="column" flexGrow={1}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
