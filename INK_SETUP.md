# Ink CLI Setup Guide

This project has been configured to use Ink, a React-based CLI framework, for building interactive command-line applications.

## Core Dependencies

The following core dependencies have been configured:

- **ink**: Core Ink framework (^6.5.1)
- **react**: React for Ink components (^19.2.3)
- **@inkjs/ui**: UI components for Ink (^2.0.0)
- **commander**: CLI command handling (^14.0.2)

## Development Scripts

### Build Commands
- `npm run build` - Build the project for production
- `npm run build:watch` - Build with watch mode for development
- `npm run clean` - Clean the dist directory

### Development Commands
- `npm run dev` - Build and run the application
- `npm run dev:watch` - Build with watch mode and run
- `npm run dev:interactive` - Run in interactive mode (recommended for development)
- `npm start` - Run the built application

### Code Quality
- `npm run lint` - Run ESLint on source files
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking without emitting files

### Testing
- `npm test` - Run the test suite

## Project Structure

```
src/
├── components/
│   └── App.tsx          # Main Ink application component
├── core/
│   ├── state.ts         # Application state management
│   └── repl.ts          # REPL utilities
├── commands/            # CLI command implementations
├── services/            # API and business logic services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── main.ts              # Application entry point
```

## Ink Application Structure

### Main App Component
The `App` component is the root of your Ink application:

```tsx
interface AppProps {
  initialState: State;
}

export default function App({ initialState }: AppProps) {
  // Component logic using Ink components
  return (
    <Box flexDirection="column">
      {/* Your UI components */}
    </Box>
  );
}
```

### Key Ink Components Used
- `<Box>` - Layout container with flexbox-like properties
- `<Text>` - Text rendering with color and style support
- `useInput` - Hook for handling keyboard input
- `<Static>` - For persistent output that doesn't re-render

### Input Handling
Use the `useInput` hook for handling keyboard input:

```tsx
useInput((input, key) => {
  if (key.return) {
    // Handle Enter key
  } else if (key.backspace) {
    // Handle backspace
  } else if (!key.ctrl && !key.meta) {
    // Handle regular input
  }
});
```

## Development Workflow

### For Active Development
1. Use `npm run dev:watch` for continuous building and running
2. Changes to source files will automatically rebuild and restart the app
3. Use `npm run lint:fix` to maintain code quality

### For Production Builds
1. Run `npm run build` to create optimized production build
2. Use `npm start` to run the production version

### Testing Changes
1. Use `npm run dev:interactive` for the best development experience
2. This mode provides better terminal interaction support

## State Management

The application uses a centralized state pattern:

- `State` interface defines the application state structure
- `initState()` function creates and initializes the state
- State is passed to the App component as props
- Individual commands modify state through callbacks

## Command System

Commands are registered in the state and follow this pattern:

```tsx
export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};
```

## TypeScript Configuration

The project uses separate TypeScript configurations:
- `tsconfig.json` - Base configuration for development
- `tsconfig.build.json` - Build-specific configuration (excludes tests)

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **State Management**: Use React state hooks for component-local state
3. **Error Handling**: Implement proper error handling in command callbacks
4. **Type Safety**: Leverage TypeScript types for better development experience
5. **Performance**: Use `<Static>` for persistent output to avoid re-renders

## Troubleshooting

### Raw Mode Not Supported
If you see the "Raw mode is not supported" error:
- Use `npm run dev:interactive` for better terminal support
- Ensure you're running in a proper terminal environment

### TypeScript Errors
- Run `npm run type-check` to identify type issues
- Use `npm run lint` to catch code quality issues

### Build Issues
- Run `npm run clean` to clear build artifacts
- Ensure all dependencies are installed with `npm install`
