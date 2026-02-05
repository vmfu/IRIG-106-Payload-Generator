# IRIG 106 Payload Generator

A browser-based telemetry payload generator for IRIG 106 Chapter 4 standard. Creates binary telemetry data, TMATS metadata, and configuration reports for testing telemetry processing systems.

## Features

- **Modular Architecture** - Organized code structure for easy maintenance
- **Browser-Based** - No installation, no build process required
- **8 Data Types** - UB, SB, IEEE754, DOUBLE, MIL1750A, TIMECODE, DISCRETE, CONTAINER
- **8 Behaviors** - Sine, ramp, random, counter, frozen, time, formula, discrete
- **Subcommutation** - Round-robin container routing
- **Error Injection** - Configurable Bit Error Rate (BER)
- **Output Formats** - .bin, .tmats, .txt, .json
- **Visualization** - Waterfall charts, hex viewer, data tables
- **Loopback Testing** - Built-in encode/decode validation
- **Bilingual UI** - English and Russian support

## Quick Start

Simply open `index.html` in any modern web browser.

No installation or build process required.

**Note**: The application has been refactored from a monolithic HTML file into a modular structure for better maintainability. All functionality remains identical.

## Project Structure

```
IRIG 106 Payload Generator/
├── index.html              # Main application entry point
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── constants.js        # VERSION, TRANSLATIONS, translation helpers
│   ├── state.js            # Global application state
│   ├── utils.js            # Language utilities
│   ├── language.js         # Language switching
│   ├── bitwriter.js        # Bit-level encoding utilities
│   ├── formulas.js         # Value generation behaviors
│   ├── encoding.js         # Telemetry encoding logic
│   ├── generation.js       # Main generation functions
│   ├── loopback.js         # Loopback testing
│   ├── initialization.js   # Default parameters
│   ├── ui.js               # UI management (tabs, parameter tree)
│   ├── parameter-editor.js # Parameter editing
│   ├── modals.js           # Modal dialogs
│   ├── visualization.js    # Charts, hex viewer, data tables
│   ├── tmats.js            # TMATS metadata generation
│   ├── download.js         # File download functions
│   └── main.js             # Entry point and event listeners
├── vendor/
│   └── chart.min.js        # Chart.js library
├── REFACTORING.md          # Refactoring documentation
└── AGENTS.md               # Development documentation
```

## Usage

1. **Configure** - Add parameters with types, behaviors, and formulas
2. **Generate** - Specify frame count and data rate
3. **Visualize** - Review waterfall charts and hex output
4. **Download** - Export binary data, TMATS, and configuration files

## Data Types

| Type | Description |
|------|-------------|
| UB | Unsigned Binary |
| SB | Signed Binary |
| IEEE754 | IEEE 754 floating point |
| DOUBLE | 64-bit double precision |
| MIL1750A | MIL-STD-1750A floating point |
| TIMECODE | IRIG time code |
| DISCRETE | Boolean/discrete values |
| CONTAINER | Nested parameters (subcommutation) |

## Parameter Behaviors

- **Sine** - Sinusoidal wave with configurable amplitude and frequency
- **Ramp** - Linear ramp between min/max values
- **Random** - Random values within range
- **Counter** - Incrementing counter
- **Frozen** - Constant value
- **Time** - Current timestamp
- **Formula** - Custom JavaScript expression
- **Discrete** - Discrete value set

## Formula Syntax

Use JavaScript expressions with access to:
- Parameter values: `p.PARAMETER_ID`
- Time variable: `t` (seconds)
- Math functions: `Math.sin()`, `Math.cos()`, etc.

Example: `p.TEMP * Math.sin(t * 0.1) + 20`

## Requirements

Modern web browser (Chrome, Firefox, Edge, Safari)

## Author

Vladimir Funtikov

## License

MIT License - see LICENSE file
