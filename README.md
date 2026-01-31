# IRIG 106 Payload Generator

A browser-based telemetry payload generator for IRIG 106 Chapter 4 standard. Creates binary telemetry data, TMATS metadata, and configuration reports for testing telemetry processing systems.

## Features

- **Single-File Application** - No installation, runs directly in browser
- **8 Data Types** - UB, SB, IEEE754, DOUBLE, MIL1750A, TIMECODE, DISCRETE, CONTAINER
- **8 Behaviors** - Sine, ramp, random, counter, frozen, time, formula, discrete
- **Subcommutation** - Round-robin container routing
- **Error Injection** - Configurable Bit Error Rate (BER)
- **Output Formats** - .bin, .tmats, .txt, .json
- **Visualization** - Waterfall charts, hex viewer, data tables
- **Loopback Testing** - Built-in encode/decode validation
- **Bilingual UI** - English and Russian support

## Quick Start

Simply open `IRIG 106 Payload Generator.html` in any modern web browser.

No installation or build process required.

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
