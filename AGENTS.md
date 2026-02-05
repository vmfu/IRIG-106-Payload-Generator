# AGENTS.md - IRIG 106 Payload Generator

## Project Overview

This is a **modular HTML/JavaScript application** for generating IRIG 106 Chapter 4 telemetry payloads. The tool creates binary telemetry data (.bin), TMATS metadata (.tmats), and configuration reports for testing telemetry processing systems in aerospace, defense, and scientific applications.

**Author**: Vladimir Funtikov
**Version**: 1.0.0
**Theme**: Dark Sci-Fi Theme (JavaScript Edition)

**Architecture**: Modular (separated HTML, CSS, and JavaScript files)

---

## Directory Structure

```
IRIG 106 Payload Generator/
├── index.html                              # Main application entry point
├── css/
│   └── styles.css                          # Application styles
├── js/
│   ├── constants.js                        # VERSION, TRANSLATIONS, translation helpers
│   ├── state.js                            # Global application state
│   ├── utils.js                            # Language utilities
│   ├── language.js                         # Language switching
│   ├── bitwriter.js                        # Bit-level encoding utilities
│   ├── formulas.js                         # Value generation behaviors
│   ├── encoding.js                         # Telemetry encoding logic
│   ├── generation.js                       # Main generation functions
│   ├── loopback.js                         # Loopback testing
│   ├── initialization.js                   # Default parameters
│   ├── ui.js                               # UI management (tabs, parameter tree)
│   ├── parameter-editor.js                 # Parameter editing
│   ├── modals.js                           # Modal dialogs
│   ├── visualization.js                    # Charts, hex viewer, data tables
│   ├── tmats.js                            # TMATS metadata generation
│   ├── download.js                         # File download functions
│   └── main.js                             # Entry point and event listeners
├── vendor/
│   └── chart.min.js                        # Chart.js library
├── start_crush.bat                         # Batch file to run Crush with new UI
├── REFACTORING.md                          # Refactoring documentation
├── AGENTS.md                               # This file - development documentation
└── UX отзыв - исполнить.md                 # Russian UX feedback document
```

**Key Observations**:
- Application code is organized into modular files for better maintainability
- No build process, package.json, or external dependencies (other than Chart.js)
- The application runs entirely client-side in the browser
- All functions are exposed globally on the `window` object for HTML event handlers
- Language is a mix of English code identifiers and Russian/English UI text

---

## How to Run

### Option 1: Direct Browser Open
Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Via Crush (Development Mode)
Run the provided batch file:
```bash
start_crush.bat
```
This sets `CRUSH_NEW_UI=1` and launches Crush.

### No Build/Test Commands Required
- No `npm install`, `make`, or build steps needed
- No automated tests present
- Changes to JavaScript or CSS files are reflected immediately upon browser refresh
- All modules are loaded via `<script>` tags in the correct order

---

## Available LSP and MCP Tools

### Overview
This section documents the Language Server Protocol (LSP) and Model Context Protocol (MCP) tools available for working on this project, with priority ratings for common tasks.

### LSP Tools (Language Server Protocol)

#### lsp_diagnostics
- **Purpose**: Get diagnostics (errors, warnings, hints) for files or the entire project
- **Priority for this project**: HIGH
- **Use Cases**:
  - Checking for JavaScript syntax errors in JS modules
  - Identifying CSS issues in styles.css
  - Reviewing overall project health
- **Known Limitations**:
  - Some CSS diagnostics may be false positives due to custom CSS features
  - Focus on JavaScript errors and warnings rather than CSS diagnostics
- **Recommended Workflow**:
  - Run after making changes to verify JavaScript syntax
  - Use on individual JS files to catch syntax errors before testing in browser

#### lsp_references
- **Purpose**: Find all references/usage of a symbol (function, variable, class) in the codebase
- **Priority for this project**: MEDIUM
- **Use Cases**:
  - Finding where `appState.parameters` is accessed throughout the file
  - Locating all usages of `BitWriter` class methods
  - Identifying all places where a specific parameter behavior is implemented
- **Known Limitations**:
  - May not find references in dynamically evaluated code (e.g., `new Function()`)
  - Works best with standard JavaScript patterns
- **Recommended Workflow**:
  - Use before refactoring to understand impact
  - Helpful for tracing data flow in parameter configuration system

#### lsp_restart
- **Purpose**: Restart LSP clients if they become unresponsive
- **Priority for this project**: LOW (emergency only)
- **Use Cases**:
  - LSP diagnostics not updating after file changes
  - Language server becomes unresponsive
- **Known Limitations**:
  - Only needed if LSP server issues occur
- **Recommended Workflow**:
  - Restart only if experiencing unresponsiveness

---

### MCP Tools (Model Context Protocol)

#### Filesystem Tools (HIGH PRIORITY)

These tools are essential for working with the single-file HTML architecture:

- **mcp_filesystem_read_text_file** - Read file contents as text
  - Essential for reading the HTML file before editing
  - Use for reviewing specific sections (with head/tail parameters)
  - Critical: Always read file before editing to see exact formatting

- **mcp_filesystem_write_file** - Create or overwrite files
  - Use for creating new files (e.g., additional documentation)
  - Can replace entire AGENTS.md or HTML file if needed
  - ⚠️ WARNING: Overwrites entire file without backup

- **mcp_filesystem_edit_file** - Make line-based edits to files
  - Preferred for targeted changes in large files
  - Provides git-style diff showing changes
  - Supports dry-run mode to preview changes
  - ⚠️ REQUIREMENT: Old text must match exactly (including whitespace)

- **mcp_filesystem_directory_tree** - Get recursive directory structure
  - Useful for understanding project layout
  - Returns JSON structure with files and directories

- **mcp_filesystem_list_directory** - List files in a directory
  - Quick overview of available files
  - Shows [FILE] and [DIR] prefixes

- **mcp_filesystem_search_files** - Search for files matching glob patterns
  - Find all HTML files: `*.html`
  - Find all JavaScript files: `**/*.js`
  - Find specific types of files across directories

- **mcp_filesystem_get_file_info** - Get file metadata
  - Check file size, creation/modification times
  - Useful for verifying file integrity

- **mcp_filesystem_create_directory** - Create new directories
  - Useful for organizing documentation or test data

- **mcp_filesystem_move_file** - Rename or move files/directories
- **mcp_filesystem_read_media_file** - Read images or audio files
- **mcp_filesystem_read_multiple_files** - Read several files at once

**Recommended Workflow for This Project**:
1. Use `mcp_filesystem_read_text_file` to read HTML file sections before editing
2. Use `mcp_filesystem_edit_file` with exact string matches for targeted changes
3. Use dry-run mode first to preview changes
4. If edit fails due to string matching, fall back to `mcp_filesystem_write_file`

#### Research and Documentation Tools (MEDIUM PRIORITY)

- **mcp_perplexity_perplexity_search** - Web search with ranked results
  - **Use Cases**:
    - Researching IRIG 106 Chapter 4 standards
    - Finding JavaScript best practices for telemetry encoding
    - Looking up Chart.js documentation for visualization improvements
  - **Limitations**: 1-20 results max
  - **When to Use**: When you need up-to-date information or examples

- **mcp_perplexity_perplexity_research** - Deep research with citations
  - **Use Cases**:
    - Comprehensive research on telemetry data formats
    - Understanding MIL-STD-1553 or other protocols
    - Investigating best practices for client-side binary encoding
  - **When to Use**: For complex, multi-source research needs

- **mcp_perplexity_perplexity_ask** - Chat with Perplexity model
  - **Use Cases**:
    - Quick questions about IRIG 106 specifics
    - Clarifying telemetry concepts
  - **When to Use**: Simple Q&A scenarios

- **mcp_perplexity_perplexity_reason** - Deep reasoning tasks
  - **Use Cases**:
    - Complex algorithm analysis
    - Trade-off analysis for architecture decisions
  - **When to Use**: Problems requiring deep analytical reasoning

- **mcp_duckduckgo_search** - DuckDuckGo web search
  - **Alternative to Perplexity search
  - **Use Cases**: General web searches when Perplexity is unavailable

- **mcp_duckduckgo_fetch_content** - Fetch and parse webpages
  - **Use Cases**: Reading documentation from URLs
  - **Limitations**: May struggle with complex JavaScript sites

- **mcp_context7_resolve-library-id** - Find Context7-compatible library IDs
  - **Use Cases**:
    - Finding Chart.js documentation ID
    - Looking up JavaScript library references
  - **Pre-requisite**: Must call before `query-docs`

- **mcp_context7_query-docs** - Query library documentation
  - **Use Cases**:
    - Chart.js API examples and documentation
    - JavaScript pattern examples
    - Best practices for client-side applications
  - **Pre-requisite**: Call `resolve-library-id` first to get library ID
  - **Example Flow**:
    1. `resolve-library-id` with libraryName="Chart.js"
    2. Use returned library ID to call `query-docs`

**Recommended Workflow for Research**:
1. Use `mcp_perplexity_perplexity_search` for quick IRIG 106 questions
2. Use `mcp_context7_query-docs` for Chart.js API questions
3. Use `mcp_perplexity_perplexity_research` for complex protocol analysis

#### AI Analysis Tools (LOW PRIORITY)

These tools are available but have limited utility for this text-based project:

- **mcp_z_ai_tools_extract_text_from_screenshot** - OCR from screenshots
  - **Use Case**: If user provides screenshot of error or UI
  - **Not useful for**: Code editing or file manipulation

- **mcp_z_ai_tools_diagnose_error_screenshot** - Analyze error screenshots
  - **Use Case**: Diagnosing browser console errors from screenshots
  - **Not useful for**: Source code analysis

- **mcp_z_ai_tools_ui_to_artifact** - Convert UI screenshots to code/prompts
  - **Use Case**: If user provides UI mockup screenshots
  - **Not useful for**: Existing code work

- **mcp_z_ai_tools_analyze_image** - General image analysis
  - **Use Case**: Analyzing diagrams or documentation images

- **mcp_z_ai_tools_analyze_video** - Video content analysis
  - **Use Case**: If user provides video of application usage

- **mcp_z_ai_tools_understand_technical_diagram** - Analyze technical diagrams
  - **Use Case**: Understanding IRIG 106 frame structure diagrams

- **mcp_z_ai_tools_ui_diff_check** - Compare two UI screenshots
  - **Use Case**: QA testing if UI screenshots provided

- **mcp_z_ai_tools_analyze_data_visualization** - Analyze charts/graphs
  - **Use Case**: Interpreting telemetry visualization screenshots

---

### Tool Priority Matrix for Common Tasks

| Task | Primary Tools | Secondary Tools |
|------|--------------|-----------------|
| **Read HTML file** | `mcp_filesystem_read_text_file` | `view` |
| **Edit code** | `mcp_filesystem_edit_file` | `mcp_filesystem_write_file` |
| **Find function usage** | `lsp_references` | `grep` |
| **Check errors** | `lsp_diagnostics` | - |
| **Research IRIG 106** | `mcp_perplexity_perplexity_search` | `mcp_perplexity_perplexity_research` |
| **Chart.js docs** | `mcp_context7_query-docs` | `mcp_duckduckgo_fetch_content` |
| **List files** | `mcp_filesystem_list_directory` | `ls` |
| **Search files** | `mcp_filesystem_search_files` | `glob` |
| **Analyze screenshot** | `mcp_z_ai_tools_extract_text_from_screenshot` | - |
| **Fix unresponsive LSP** | `lsp_restart` | - |

---

### Tool Limitations Specific to This Project

1. **CSS Diagnostics Are False Positives**
   - LSP reports 1200+ CSS errors in AGENTS.md
   - These are expected because markdown contains code blocks
   - **Action**: Ignore CSS diagnostics, focus on JavaScript errors

2. **Single-File Editing Complexity**
   - HTML file is 6000+ lines
   - `edit_file` requires exact string matching including whitespace
   - **Action**: Always use `read_text_file` with head/tail to get context before editing
   - **Fallback**: If edit fails, use `write_file` to replace entire content

3. **Russian Character Encoding**
   - Files contain Russian characters
   - **Action**: Ensure UTF-8 encoding is preserved when using `write_file`
   - MCP tools should handle this automatically

4. **No Traditional Build Tools**
   - No package.json, npm, make, etc.
   - **Action**: Don't use tools that expect Node.js projects
   - Focus on browser-based testing

5. **Formula Evaluation Security**
   - `new Function()` is used for formula evaluation
   - **Action**: Be cautious when editing formula-related code
   - Consider security implications if user input is untrusted

---

### Recommended Workflow for Common Agent Tasks

#### Task 1: Add a New Parameter Type
1. Read parameter handling code: `view "IRIG 106 Payload Generator.html"` (look around line 3500+ for `BitWriter`)
2. Find all parameter type usages: `lsp_references` with symbol="UB" or similar
3. Read existing type implementation to understand pattern
4. Edit HTML file to add new type
5. Use `lsp_diagnostics` to check for syntax errors
6. Test in browser manually

#### Task 2: Fix Bug in startGeneration Function
1. Read the function: `view "IRIG 106 Payload Generator.html"` around line 4437+
2. Understand current implementation
3. Make targeted edit using `mcp_filesystem_edit_file`
4. Use `lsp_diagnostics` to verify syntax
5. Test generation in browser

#### Task 3: Research IRIG 106 Standard for New Feature
1. Use `mcp_perplexity_perplexity_search` with query about specific IRIG 106 requirement
2. If deep research needed: `mcp_perplexity_perplexity_research`
3. Review standard documentation if URLs are found
4. Implement feature based on research
5. Test against specification

#### Task 4: Improve Chart.js Visualization
1. Resolve Chart.js library ID: `mcp_context7_resolve-library-id` with libraryName="Chart.js"
2. Query Chart.js docs: `mcp_context7_query-docs` with returned library ID
3. Find relevant Chart.js examples
4. Edit HTML file to implement improvements
5. Test visualization in browser

#### Task 5: Understand Existing Parameter Configuration
1. Find parameter object usages: `lsp_references` with symbol="parameters"
2. Read parameter initialization code: look for where `appState.parameters` is created
3. Understand parameter structure: read around line 3500-4000
4. Make changes as needed

---

## Code Architecture

### Single-File Structure
The application is organized within a single HTML file with these sections:

1. **HTML Structure** (Lines 1-2400+)
   - Header with language switcher (RU/EN)
   - Tab-based navigation: Configuration, Generation, Results, Download, Help
   - Parameter tree view with nested container support
   - Modal dialogs and forms

2. **CSS Styles** (Lines 8-633)
   - Dark sci-fi theme (gradient backgrounds, cyan accents)
   - Custom scrollbar styling
   - Responsive design with media queries
   - Specific styles for tree view, hex viewer, charts

3. **JavaScript** (Lines 3204-end)
   - **Constants & Translations** (Lines 3205-3710)
     - `VERSION = "1.0.0"`
     - `TRANSLATIONS` object with RU/EN language strings
   - **State Management**
     - `appState` - Global state object (parameters, isGenerating, etc.)
   - **Core Functions** (see below)

### Key JavaScript Functions

#### Data Generation
- `startGeneration()` (Line ~4437) - Entry point for payload generation
- `generatePayload(numFrames, samplingRate)` - Main generation logic
- `generateTMATS()` (Line ~5232) - Creates TMATS metadata file
- `computeValue(param, frameIdx, allParams, allValues, time)` - Computes parameter values based on behavior

#### Encoding/Decoding
- `encodeRecursive(value, param, bitWriter, frameIdx)` (Line ~4574) - Handles encoding including CONTAINER subcommutation
- `BitWriter` class (Line ~4513) - Bit-level writing with byte order and bit order support
  - Methods: `writeBits()`, `getBuffer()`, `reset()`, `getTotalBytes()`
- Various type-specific encoders: `encodeUB()`, `encodeSB()`, `encodeIEEE754()`, `encodeDOUBLE()`, `encodeMIL1750A()`, `encodeTIMECODE()`, `encodeDISCRETE()`

#### UI Management
- `renderTree()` - Renders parameter tree with nested containers
- `switchTab(tabId)` - Tab navigation
- `switchLanguage(lang)` - Bilingual support (RU/EN)
- `selectParameter(path)` - Opens parameter editor
- `saveParameterFromEditor()` - Saves parameter changes

#### Visualization
- `updateCharts()` - Updates Chart.js visualizations
- `drawWaterfall()` - Draws byte waterfall visualization
- `updateHexViewer()` (Line ~4472) - Displays binary data in hex/ASCII format

#### Import/Export
- `loadConfig()` - Loads JSON configuration
- `saveConfig()` - Exports current configuration as JSON
- `downloadBinary()`, `downloadTMATS()`, `downloadReport()`, `downloadJSON()` - File downloads

---

## Data Types Supported

The application encodes telemetry parameters in IRIG 106 Chapter 4 formats:

| Type      | Description                           | Bits  | Use Case                     |
|-----------|--------------------------------------|--------|------------------------------|
| UB        | Unsigned Binary (no sign)            | 8-64  | Counters, IDs, voltages     |
| SB        | Signed Binary (two's complement)      | 8-64  | Temperatures, offsets        |
| IEEE754   | 32-bit floating point                | 32     | Pressures, velocities        |
| DOUBLE    | 64-bit floating point                | 64     | GPS coordinates, precision   |
| MIL1750A  | MIL-STD-1750A 32-bit float         | 32     | Legacy systems              |
| TIMECODE  | IRIG time code (High/Low)           | 48-64  | Mission timestamps          |
| DISCRETE  | Bit flags / discrete states          | 8-64   | Status modes, switches      |
| CONTAINER | Subcommutation container             | N/A    | Bandwidth optimization      |

---

## Parameter Behaviors

Parameters can generate values in different ways:

| Behavior      | Description                                      | Parameters Used                |
|---------------|--------------------------------------------------|-------------------------------|
| sine          | Periodic oscillation                              | frequency, noise             |
| ramp          | Linear increase from min to max                   | frequency                   |
| random        | Random values in range                            | min, max                   |
| counter       | Auto-increment (mod max)                         | min, max                   |
| frozen        | Constant value (midpoint of range)               | min, max                   |
| time          | Microsecond timestamp from start                  | sampling rate              |
| formula       | JavaScript expression referencing other params       | formula, dependsOn         |
| discrete      | Random 0/1 or discrete states                  | min, max                   |
| subcommutated | Round-robin child parameter selection (CONTAINER) | subParams array            |

### Formula Behavior
- JavaScript expressions can reference other parameters using `p.PARAMETER_ID`
- Variable `t` (time in seconds) is available
- Math functions available: `Math.sin()`, `Math.cos()`, `Math.sqrt()`, etc.
- Dependency tracking ensures parameters are computed in correct order

---

## Subcommutation (CONTAINER Type)

Containers implement round-robin subcommutation for bandwidth optimization:

- Each frame transmits only one child parameter
- Child parameters cycle through in order: `frameIdx % subParams.length`
- Nested containers are supported (subcommutation within subcommutation)
- Requires an accompanying counter parameter (`SUBCOMIDCNT`) to track active slot

**Example**:
```
SUBCOM_CONTAINER (9 slots, 100 Hz sampling)
├─ Slot 0: BATTERY_VOLTAGE_A  → 100/9 ≈ 11 Hz per parameter
├─ Slot 1: BATTERY_VOLTAGE_B
├─ Slot 2: TANK_FUEL_TEMP
├─ ...
└─ Slot 8: CHECKSUM_SUB
```

---

## Loopback Testing

When "Enable Loopback Testing" is checked:
1. After generation, binary data is decoded back to values
2. Decoded values are compared with original values
3. Reports percentage error for each parameter
4. Helps validate encoding/decoding correctness and bit/byte order settings

---

## Error Injection

- "Enable Error Injection" checkbox adds random bit errors
- BER (Bit Error Rate) parameter: 0.0001 = ~1 error per 10,000 bits
- Used to test error correction algorithms in telemetry receivers

---

## Byte Order and Bit Order

The application supports both:
- **Byte Order**: Big-Endian (MSB first) or Little-Endian (LSB first)
- **Bit Order**: MSB-first or LSB-first

These settings affect how multi-byte values are encoded in the binary output.

---

## Internationalization (i18n)

The application is fully bilingual (Russian/English):

- `TRANSLATIONS` object contains all UI strings
- `switchLanguage('ru' | 'en')` updates all text elements
- Language state is stored and can be persisted (not currently implemented in localStorage)

**Implementation Pattern**:
```javascript
// Usage in HTML
<span data-i18n="pageTitle">🚀 IRIG 106 Payload Generator</span>

// Update in JS
function switchLanguage(lang) {
  const translations = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.textContent = translations[key];
  });
}
```

---

## State Management

Global state stored in `appState` object:
- `parameters` - Array of parameter objects (flat with parent references)
- `isGenerating` - Boolean flag for generation state
- `generatedData` - Array of generated frame data
- `frameData` - Array of decoded frame data
- `binData` - Uint8Array of binary output
- `tmatsData` - String containing TMATS metadata

---

## Parameter Object Structure

```javascript
{
  id: "PARAMETER_ID",           // Unique identifier
  desc: "Description text",      // User description
  word: 10,                    // Word position in frame
  type: "IEEE754",             // Data type (see table above)
  bits: 32,                     // Number of bits (1-64)
  units: "kPa",                 // Physical units (optional)
  min: 0,                       // Minimum value
  max: 100,                     // Maximum value
  behavior: "sine",             // Generation behavior
  frequency: 0.1,               // For sine/ramp (Hz)
  noise: 0.5,                   // Noise level (std dev)
  formula: "",                  // For formula behavior
  dependsOn: "A,B",             // Comma-separated dependencies
  subParams: []                 // For CONTAINER: child parameters
}
```

For containers with nested subcommutation:
- `subParams` is an array of child parameter objects
- Recursive nesting is supported (containers within containers)

---

## Output Files

### 1. Binary Payload (.bin)
- IRIG 106 Chapter 4 PCM format
- Contains all telemetry frames
- Bit-exact encoding based on parameter configuration
- Byte order and bit order configurable

### 2. TMATS Metadata (.tmats)
- Text-based metadata file describing telemetry structure
- Allows automatic decoding by IRIG 106 compliant receivers
- Format: `G\DSI-1:...`, `P-1\DLN:...` etc.

### 3. Report (.txt)
- Human-readable configuration summary
- Lists all parameters, types, behaviors, and computed statistics

### 4. JSON Config (.json)
- Full parameter configuration export
- Can be re-imported to restore state
- Useful for version control and sharing

---

## Visualization Features

### Waterfall Chart
- Canvas-based visualization of byte values across frames
- X-axis: Byte offset within frame
- Y-axis: Frame number
- Color mapping based on byte value

### Hex Viewer
- Displays first 1024 bytes of binary output
- Shows offset (hex), bytes (hex), and ASCII representation
- Scrollable container for large files

### Data Table
- First 20 frames of decoded data
- Columns for each parameter
- Filterable and sortable (if extended)

### Charts
- Uses Chart.js for parameter visualization
- Line charts showing value vs. time
- Up to 2 parameters displayed simultaneously

---

## Important Gotchas & Non-Obvious Patterns

1. **Single File Architecture**: All code is in one file. CSS selectors in the `<style>` block may conflict if embedding in other contexts.

2. **BigInt Usage**: The `BitWriter` class uses `BigInt` for bit manipulation to support up to 64-bit values. Ensure all values are converted to `BigInt` before bitwise operations.

3. **Container Handling**: Containers don't encode their own value—they route to one child parameter per frame based on `frameIdx % subParams.length`. This is handled in `encodeRecursive()`.

4. **Formula Dependencies**: When using formula behavior, ensure:
   - All referenced parameters exist (case-sensitive IDs)
   - No circular dependencies (A→B→A)
   - Handle edge cases (e.g., division by zero)

5. **Loopback Precision**: IEEE754 (32-bit) values may show up to 0.0001% error due to rounding. DOUBLE (64-bit) should show <10⁻¹⁵% error.

6. **Language Switch**: Only updates elements with `data-i18n` attribute. Hardcoded strings (especially in console output) may not translate.

7. **Chart.js Dependency**: External `chart.min.js` file must be present in `IRIG 106 Payload Generator_files/` directory.

8. **No Server Required**: Application runs entirely client-side. No backend or build process needed.

9. **Hex Viewer Limitation**: Only displays first 1024 bytes to prevent browser freezing. For full inspection, download the binary file.

10. **Subcommutation Synchronization**: The counter parameter (`SUBCOMIDCNT`) must be placed BEFORE the container in the frame structure for proper decoding.

---

## Testing and Debugging

### Manual Testing Workflow:
1. Open application in browser
2. Configure parameters (or use default demo configuration)
3. Set number of frames and sampling rate
4. Enable "Loopback Testing" for validation
5. Click "Generate Payload"
6. Review console output for errors
7. Check Results tab for charts and hex viewer
8. Download .bin, .tmats, and .json files

### Console Logging:
- `consoleLog(message, type)` function outputs to in-app console
- Types: 'info', 'success', 'error', 'warning'
- Timestamped messages appear in Generation tab

### Browser DevTools:
- Use F12 to open developer console
- Network tab shows no external requests (all client-side)
- Sources tab shows embedded JavaScript

---

## Code Conventions

### Naming:
- **Functions**: camelCase (`startGeneration`, `encodeRecursive`, `updateHexViewer`)
- **Constants**: UPPER_SNAKE_CASE (`VERSION`, `TRANSLATIONS`)
- **Variables**: camelCase (`appState`, `bitWriter`, `frameIdx`)
- **HTML IDs**: kebab-case (`num-frames`, `sampling-rate`, `tree-container`)
- **CSS Classes**: kebab-case (`.tree-row`, `.param-type-badge`, `.hex-viewer`)

### Comments:
- Russian language comments in some code sections
- Section headers use `// ===== SECTION NAME =====`
- Inline comments explain complex logic (e.g., bit manipulation)

### Error Handling:
- Minimal try-catch usage
- Errors logged to console via `consoleLog()`
- User-facing errors via `alert()` in some cases

---

## Known Issues (from UX Feedback)

The file `UX отзыв - исполнить.md` contains detailed UX feedback in Russian, including:
1. Parameter list clutter with 30+ entries
2. Lack of real-time validation feedback
3. Formula input is plain text (no autocomplete or syntax highlighting)
4. Help section is too long and unorganized
5. Progress bar for large generations may appear stuck
6. Download buttons disabled until generation completes (unclear UX)
7. No presets or templates for common mission types
8. No undo/redo for parameter edits
9. Import/export JSON controls are hard to find
10. No configuration comparison or version history

These issues are documented but not yet addressed in the codebase.

---

## Future Enhancement Opportunities

Based on code structure and UX feedback:

1. **Web Workers**: Move generation to background thread for non-blocking UI
2. **Virtual Scrolling**: Implement for large parameter lists
3. **Formula Editor**: Add Monaco Editor for syntax highlighting and autocomplete
4. **LocalStorage**: Auto-save configurations to prevent data loss
5. **Search/Filter**: Add parameter search in tree view
6. **Drag-and-Drop**: Allow parameter reordering
7. **Responsive Design**: Improve mobile/tablet layout
8. **Unit Tests**: Implement automated testing framework
9. **Validation**: Real-time formula validation and dependency checking
10. **Export Options**: Add more output formats (CSV, XML, custom TMATS variants)

---

## Quick Reference for Agents

### When modifying parameters:
- Parameter objects are in `appState.parameters` array
- Containers have `subParams` array for nested children
- Call `renderTree()` after modifying to update UI

### When adding new data types:
- Add encoder function: `encodeTYPE(value, bits)`
- Add decoder function: `decodeTYPE(bytes, byteOffset, bitOffset, bits)`
- Update type dropdown in HTML and TRANSLATIONS
- Handle special cases in `encodeRecursive()`

### When modifying behaviors:
- Update `computeValue()` function (add case for new behavior)
- Add parameter inputs to parameter editor HTML if needed
- Update TRANSLATIONS with behavior names

### When changing UI:
- HTML elements must have `data-i18n` attributes for translation
- CSS styles are in `<style>` block (lines 8-633)
- Use existing color palette: cyan (#00bcd4), green (#4caf50), red (#ff6b6b), etc.

### When debugging generation:
- Check console output in Generation tab
- Enable "Loopback Testing" for validation
- Review generated data in Results tab (charts, hex viewer, data table)
- Download JSON config to inspect parameter objects

---

## Contact & Credits

**Developed by**: Vladimir Funtikov
**Purpose**: Educational IRIG 106 telemetry generator for learning and training
**Theme**: Dark Sci-Fi Theme (JavaScript Edition)
**Version**: 1.0.0

For detailed IRIG 106 standard information, refer to:
- IRIG 106-19: Telemetry Standards
- Chapter 4: PCM Formats
- Appendix D: TMATS Attribute Transfer Standard
