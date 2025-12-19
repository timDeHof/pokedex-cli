import React from "react";
import { Box, Text } from "ink";

interface ScreenContainerProps {
  title: string;
  pageNumber?: number;
  children: React.ReactNode;
}

export default function ScreenContainer({
  title,
  pageNumber,
  children,
}: ScreenContainerProps) {
  return (
    <Box flexDirection="column" height="100%">
      {/* Screen header with title and page number */}
      <Box
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom={1}
        borderStyle="round"
        borderColor="cyan"
      >
        <Box flexDirection="row" justifyContent="space-between" width="100%">
          <Text bold color="cyan">
            {title}
          </Text>
          {pageNumber !== undefined && (
            <Text dimColor>Page {pageNumber + 1}</Text>
          )}
        </Box>
      </Box>

      {/* Screen content */}
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}
