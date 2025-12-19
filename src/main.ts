import React from "react";
import { render } from "ink";
import App from "./components/App.js";
import { initState } from "./core/state.js";

// Check if stdin supports raw mode (for non-interactive environments)
if (!process.stdin.isTTY) {
  console.warn(
    "Warning: Running in non-interactive mode. Some features may not work correctly."
  );
}

// Initialize state for Ink app (but don't use the readline interface)
const state = initState();

// Render the Ink app
render(React.createElement(App, { initialState: state }));
