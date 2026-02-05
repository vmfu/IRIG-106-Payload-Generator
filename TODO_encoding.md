# TODO - Encoding/Decoding Algorithms Verification & Enhancement

## Project Overview
This document tracks tasks for researching, verifying, enhancing, and testing data encoding/decoding algorithms in the IRIG 106 Payload Generator.

**Current Implementation Location**: `js/encoding.js`

## Supported Data Types
| Type | Status | Notes |
|------|---------|-------|
| UB (Unsigned Binary) | ✅ Implemented | 8-64 bits |
| SB (Signed Binary) | ✅ Implemented | Two's complement, 8-64 bits |
| IEEE754 (Float) | ✅ Implemented | 32-bit |
| DOUBLE (Float) | ✅ Implemented | 64-bit |
| MIL-STD-1750A (Float) | ⚠️ Needs Verification | 32-bit military format |
| TIMECODE | ⚠️ Needs Verification | IRIG time code format |
| DISCRETE | ✅ Implemented | Boolean flag |
| SCALEDINT | ✅ Implemented | Linear scaling |
| CONTAINER | ✅ Implemented | Subcommutation routing |

---

## IMPORTANT: Instructions for Using MCP Search Tools

**This TODO document requires the use of MCP (Model Context Protocol) search tools to complete tasks.**

### Available MCP Search Tools:
- `mcp_duckduckgo_search` - Web search using DuckDuckGo
- `mcp_perplexity_perplexity_search` - Web search with ranked results
- `mcp_perplexity_perplexity_research` - Deep research with citations
- `mcp_context7_query-docs` - Query library documentation (requires library ID)

### When to Use MCP Tools:

**Use BEFORE making changes:**
- When researching IRIG 106 standards (e.g., "IRIG 106 Chapter 4 MIL-STD-1750A encoding")
- When verifying encoding algorithms against official specifications
- When looking for test vectors or reference implementations
- When investigating edge cases or corner cases for data types

**Use WHEN encountering issues:**
- If loopback tests show unexpected errors
- If encoded values don't match expected outputs
- If you're unsure about the correct implementation

**Use FOR validation:**
- Compare your implementation with standard documentation
- Find example test cases to validate algorithms
- Search for known bugs or pitfalls in similar implementations

### Example MCP Usage:
```javascript
// To research MIL-STD-1750A format:
mcp_perplexity_perplexity_search({
  query: "MIL-STD-1750A 32-bit floating point encoding specification"
})

// To verify IEEE754 implementation:
mcp_perplexity_perplexity_research({
  query: "IEEE 754 32-bit binary32 format encoding algorithm test cases"
})

// To find IRIG 106 time code standard:
mcp_duckduckgo_search({
  query: "IRIG 106 Chapter 4 time code format specification"
})
```

---

## Phase 1: Research & Verification

### Task 1.1: Verify MIL-STD-1750A Float Encoding
**Status**: ❌ Not Started
**Priority**: HIGH
**Files**: `js/encoding.js:2-24` (`floatToMil1750A`)

**Current Implementation**:
- Exponent range: -128 to +127
- 23-bit mantissa
- Simple clamp for out-of-range values

**Research Required**:
1. [ ] Use MCP search to find official MIL-STD-1750A specification
2. [ ] Verify exponent bias value (currently using +1 offset)
3. [ ] Verify mantissa normalization
4. [ ] Check for special values: infinity, NaN, denormals
5. [ ] Find reference test vectors

**Search Queries**:
- "MIL-STD-1750A 32-bit floating point specification"
- "MIL-STD-1750A exponent bias"
- "MIL-STD-1750A floating point encoding test vectors"

**Verification Checklist**:
- [ ] Exponent calculation matches spec
- [ ] Mantissa scaling matches spec
- [ ] Special values (inf, -inf, NaN, 0) handled correctly
- [ ] Range overflow/underflow handling correct

**Expected Output**:
Test cases showing correct encoding/decoding for:
- Zero: 0.0
- Normal values: 1.0, -1.0, 3.14159, -123.456
- Large values: 1e20, -1e20
- Small values: 1e-20, -1e-20
- Special: Infinity, NaN

---

### Task 1.2: Verify TIMECODE Format
**Status**: ❌ Not Started
**Priority**: HIGH
**Files**: `js/encoding.js:42-59`

**Current Implementation**:
- 48-bit format: [16-bit days][32-bit milliseconds]
- Optional 16-bit padding for 64-bit variant
- Simple concatenation

**Research Required**:
1. [ ] Search for IRIG 106 Time Code format specification
2. [ ] Verify bit layout for IRIG time codes
3. [ ] Check for different time code formats (A, B, C, D, E, F, G)
4. [ ] Verify epoch/start date
5. [ ] Find reference implementations

**Search Queries**:
- "IRIG 106 Chapter 4 time code format specification"
- "IRIG time code binary format days milliseconds"
- "IRIG standard time encoding IRIG-106"

**Verification Checklist**:
- [ ] Days field size and range correct
- [ ] Milliseconds field size and range correct
- [ ] Bit ordering matches spec (MSB/LSB first)
- [ ] Epoch/start date documented
- [ ] 48-bit vs 64-bit variants identified

**Expected Output**:
Documentation of:
- Exact bit layout for time code
- Range (maximum days/seconds)
- Epoch/start time
- Any variants (A/B/C/D/E/F/G)

---

### Task 1.3: Verify IEEE754 Implementation
**Status**: ⚠️ Needs Verification
**Priority**: MEDIUM
**Files**: `js/encoding.js:105-110`

**Current Implementation**:
```javascript
const arr = new Float32Array([numValue]);
const view = new Uint32Array(arr.buffer);
encoded = BigInt(view[0]);
```

**Research Required**:
1. [ ] Verify Float32Array to Uint32Array conversion produces IEEE754 binary32
2. [ ] Check endianness handling
3. [ ] Verify byte order matches IRIG 106 spec

**Search Queries**:
- "JavaScript Float32Array Uint32Array IEEE 754 conversion endianness"
- "IRIG 106 floating point byte order specification"

**Verification Checklist**:
- [ ] Float32Array uses IEEE754 binary32 format (verified by JS spec)
- [ ] Byte order consistent across different platforms
- [ ] Matches IRIG 106 Chapter 4 specification

**Expected Output**:
Test cases verifying correct encoding of:
- Normal values: 1.0, -1.0, 3.14159, -123.456
- Large values: 1e30, -1e30
- Small values: 1e-30, -1e-30
- Special: Infinity, -Infinity, NaN

---

### Task 1.4: Verify DOUBLE (64-bit) Implementation
**Status**: ⚠️ Needs Verification
**Priority**: MEDIUM
**Files**: `js/encoding.js:112-117`

**Current Implementation**:
```javascript
const arr = new Float64Array([numValue]);
const view = new BigUint64Array(arr.buffer);
encoded = view[0];
```

**Research Required**:
1. [ ] Verify Float64Array to BigUint64Array conversion produces IEEE754 binary64
2. [ ] Check BigUint64Array browser support
3. [ ] Verify endianness handling

**Search Queries**:
- "JavaScript Float64Array BigUint64Array IEEE 754 double conversion"
- "BigUint64Array browser compatibility IE11"

**Verification Checklist**:
- [ ] Float64Array uses IEEE754 binary64 format (verified by JS spec)
- [ ] BigUint64Array supported in target browsers
- [ ] Byte order consistent

**Expected Output**:
Test cases for double precision values

---

### Task 1.5: Verify Signed Binary (Two's Complement)
**Status**: ⚠️ Needs Verification
**Priority**: MEDIUM
**Files**: `js/encoding.js:87-99`

**Current Implementation**:
```javascript
const maxSB = Math.pow(2, param.bits - 1) - 1;
const minSB = -Math.pow(2, param.bits - 1);
const clampedSB = Math.max(minSB, Math.min(maxSB, Math.round(numValue)));

if (clampedSB >= 0) {
    encoded = BigInt(clampedSB);
} else {
    encoded = BigInt((1n << BigInt(param.bits)) + BigInt(clampedSB));
}
```

**Research Required**:
1. [ ] Verify two's complement formula
2. [ ] Check range calculations
3. [ ] Verify bit range for different sizes (8, 16, 32, 64 bits)

**Search Queries**:
- "Two's complement encoding negative numbers formula"
- "Two's complement range for n bits calculation"
- "IRIG 106 signed binary format"

**Verification Checklist**:
- [ ] Max value = 2^(bits-1) - 1 (correct)
- [ ] Min value = -2^(bits-1) (correct)
- [ ] Two's complement formula correct
- [ ] Edge cases: -128 for 8-bit, -32768 for 16-bit

**Expected Output**:
Test cases for each bit width:
- 8-bit: -128 to +127
- 16-bit: -32768 to +32767
- 32-bit: -2^31 to +2^31-1
- 64-bit: -2^63 to +2^63-1

---

## Phase 2: Missing Decoders for Loopback Testing

### Task 2.1: Implement decodeUB
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for unsigned binary parameters

**Requirements**:
1. [ ] Create function that reads bits and returns decoded integer
2. [ ] Handle 8-64 bit ranges
3. [ ] Return JavaScript Number or BigInt as appropriate

**Signature**:
```javascript
function decodeUB(bytes, byteOffset, bitOffset, bits) {
    // Read bits at specified offset
    // Return decoded unsigned value
}
```

**Test Cases**:
- 8-bit: 0, 127, 255
- 16-bit: 0, 32767, 65535
- 32-bit: 0, 2147483647, 4294967295

---

### Task 2.2: Implement decodeSB
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for signed binary parameters

**Requirements**:
1. [ ] Create function that reads bits and returns signed integer
2. [ ] Implement two's complement decoding
3. [ ] Handle 8-64 bit ranges

**Signature**:
```javascript
function decodeSB(bytes, byteOffset, bitOffset, bits) {
    // Read bits at specified offset
    // Apply two's complement if MSB set
    // Return decoded signed value
}
```

**Test Cases**:
- 8-bit: -128, -1, 0, 1, 127
- 16-bit: -32768, -1, 0, 1, 32767

---

### Task 2.3: Implement decodeIEEE754
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for 32-bit float parameters

**Requirements**:
1. [ ] Create function that reads 32 bits and returns IEEE754 float
2. [ ] Handle endianness
3. [ ] Handle special values (inf, -inf, NaN)

**Signature**:
```javascript
function decodeIEEE754(bytes, byteOffset, bitOffset, bits) {
    // Read 32 bits
    // Convert to Float32
    // Return decoded float
}
```

**Test Cases**:
- Normal: 1.0, -1.0, 3.14159, -123.456
- Large: 1e30, -1e30
- Small: 1e-30, -1e-30
- Special: Infinity, -Infinity, NaN

---

### Task 2.4: Implement decodeDOUBLE
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for 64-bit float parameters

**Requirements**:
1. [ ] Create function that reads 64 bits and returns IEEE754 double
2. [ ] Handle endianness
3. [ ] Handle special values

**Signature**:
```javascript
function decodeDOUBLE(bytes, byteOffset, bitOffset, bits) {
    // Read 64 bits
    // Convert to Float64
    // Return decoded double
}
```

**Test Cases**:
- High precision values that differ from 32-bit
- Large/small values
- Special values

---

### Task 2.5: Implement decodeMIL1750A
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for MIL-STD-1750A parameters

**Requirements**:
1. [ ] Create inverse of `floatToMil1750A`
2. [ ] Extract exponent and mantissa
3. [ ] Reconstruct floating point value

**Signature**:
```javascript
function decodeMIL1750A(encoded) {
    // Extract exponent (8 bits)
    // Extract mantissa (23 bits)
    // Reconstruct floating point value
    // Return decoded value
}
```

**Test Cases**:
- Pair with encode tests from Task 1.1
- Verify: encode(x) then decode() ≈ x

---

### Task 2.6: Implement decodeTIMECODE
**Status**: ❌ Not Started
**Priority**: HIGH
**Purpose**: Enable loopback testing for time code parameters

**Requirements**:
1. [ ] Parse days and milliseconds fields
2. [ ] Return object with days, millis, _isTimeCode flag
3. [ ] Handle 48-bit vs 64-bit variants

**Signature**:
```javascript
function decodeTIMECODE(encoded, bits) {
    // Extract days field (16 bits)
    // Extract milliseconds field (32 bits)
    // Return { days, millis, _isTimeCode: true }
}
```

**Test Cases**:
- Days 0, millis 0
- Days 1000, millis 123456789
- Maximum values

---

### Task 2.7: Implement decodeDISCRETE
**Status**: ❌ Not Started
**Priority**: LOW
**Purpose**: Enable loopback testing for discrete/boolean parameters

**Requirements**:
1. [ ] Read single bit
2. [ ] Return boolean or 0/1

**Signature**:
```javascript
function decodeDISCRETE(bytes, byteOffset, bitOffset, bits) {
    // Read bit
    // Return 0 or 1
}
```

**Test Cases**:
- 0, 1

---

## Phase 3: Integration Testing

### Task 3.1: Create Comprehensive Test Suite
**Status**: ❌ Not Startes
**Priority**: HIGH

**Requirements**:
1. [ ] Create test data for each encoding type
2. [ ] Include edge cases and boundary values
3. [ ] Include special values (inf, NaN, zero, max, min)
4. [ ] Document expected outputs

**Test Cases to Include**:

**UB (Unsigned Binary)**:
| Bits | Input | Expected |
|-------|--------|----------|
| 8 | 0 | 0x00 |
| 8 | 127 | 0x7F |
| 8 | 255 | 0xFF |
| 16 | 0 | 0x0000 |
| 16 | 32767 | 0x7FFF |
| 16 | 65535 | 0xFFFF |
| 32 | 4294967295 | 0xFFFFFFFF |

**SB (Signed Binary)**:
| Bits | Input | Expected |
|-------|--------|----------|
| 8 | -128 | 0x80 |
| 8 | -1 | 0xFF |
| 8 | 0 | 0x00 |
| 8 | 127 | 0x7F |
| 16 | -32768 | 0x8000 |
| 16 | 32767 | 0x7FFF |

**IEEE754 (Float)**:
| Input | Hex (Big-Endian) | Notes |
|-------|------------------|-------|
| 0.0 | 0x00000000 | Zero |
| 1.0 | 0x3F800000 | One |
| -1.0 | 0xBF800000 | Minus one |
| 3.14159 | 0x40490FD0 | Pi |
| Infinity | 0x7F800000 | Positive infinity |
| -Infinity | 0xFF800000 | Negative infinity |

---

### Task 3.2: Automated Loopback Testing
**Status**: ⚠️ Partial Implementation
**Priority**: HIGH
**Current Status**: Only checks byte count, not actual values

**Requirements**:
1. [ ] Extend `performDeepLoopbackTest()` to decode binary data
2. [ ] Compare decoded values with original generated values
3. [ ] Report percentage error for each parameter
4. [ ] Highlight parameters with errors > threshold

**Implementation Location**: `js/loopback.js`

**Current Code**:
```javascript
window.performDeepLoopbackTest = function() {
    if (!appState.binData) return;
    // ... only checks byte count, not actual values
}
```

**Enhancement Needed**:
```javascript
window.performDeepLoopbackTest = function() {
    if (!appState.binData) return;

    // For each frame
    for (let frameIdx = 0; frameIdx < appState.generatedData.length; frameIdx++) {
        const frameValues = appState.generatedData[frameIdx];

        // Decode each parameter
        for (const param of appState.parameters) {
            const originalValue = frameValues[param.id];
            const decodedValue = decodeParameter(binData, param, frameIdx);

            // Compare and report error
            const errorPercent = Math.abs((decodedValue - originalValue) / originalValue) * 100;
            if (errorPercent > 0.0001) { // Allow 0.0001% tolerance
                consoleLog(`ERROR: ${param.id} error: ${errorPercent}%`, 'error');
            }
        }
    }
}
```

---

## Phase 4: Edge Cases & Boundary Testing

### Task 4.1: Test Overflow/Underflow Handling
**Status**: ❌ Not Started
**Priority**: MEDIUM

**Test Scenarios**:
1. [ ] UB values above max (should clamp)
2. [ ] SB values above max (should clamp)
3. [ ] SB values below min (should clamp)
4. [ ] Very large numbers exceeding precision
5. [ ] Very small numbers causing underflow

---

### Task 4.2: Test Special Values
**Status**: ❌ Not Started
**Priority**: MEDIUM

**Test Scenarios**:
1. [ ] IEEE754: Infinity, -Infinity, NaN
2. [ ] DOUBLE: Infinity, -Infinity, NaN
3. [ ] Timecode: Maximum days, maximum milliseconds
4. [ ] MIL1750A: Overflow, underflow

---

### Task 4.3: Test Bit Alignment Issues
**Status**: ❌ Not Started
**Priority**: HIGH

**Test Scenarios**:
1. [ ] Parameters starting at odd bit offsets
2. [ ] Parameters spanning byte boundaries
3. [ ] Parameters with non-power-of-2 bit widths (e.g., 12 bits, 23 bits)
4. [ ] Multiple parameters with misaligned sizes

---

## Phase 5: Missing Formats

### Task 5.1: Research Additional IRIG 106 Formats
**Status**: ❌ Not Started
**Priority**: LOW

**Formats to Investigate**:
1. [ ] **BCD** (Binary Coded Decimal) - Used in legacy systems
2. [ ] **PACKED** - Bit-packed structures
3. [ ] **FIXED_POINT** - Q-format fixed-point numbers
4. [ ] **COMPLEMENTARY** - One's complement integers

**Search Queries**:
- "IRIG 106 BCD encoding format"
- "IRIG 106 packed data format"
- "IRIG 106 fixed point Q format"
- "IRIG 106 Chapter 4 data types list"

---

## Phase 6: Documentation

### Task 6.1: Document Encoding Algorithms
**Status**: ❌ Not Started
**Priority**: MEDIUM

**Requirements**:
1. [ ] Create algorithm descriptions for each data type
2. [ ] Include formulas and bit layouts
3. [ ] Add reference to IRIG 106 standard
4. [ ] Document edge cases and limitations

**Location**: Add to `js/encoding.js` as comments or separate documentation file

---

### Task 6.2: Create Test Vector Documentation
**Status**: ❌ Not Started
**Priority**: LOW

**Requirements**:
1. [ ] Document official test vectors if available
2. [ ] Create custom test vectors
3. [ ] Include hex dump examples

---

## Progress Tracking

| Phase | Task | Status | Priority |
|-------|------|--------|----------|
| Phase 1 | 1.1 Verify MIL-STD-1750A | ❌ Not Started | HIGH |
| Phase 1 | 1.2 Verify TIMECODE | ❌ Not Started | HIGH |
| Phase 1 | 1.3 Verify IEEE754 | ⚠️ Needs Verification | MEDIUM |
| Phase 1 | 1.4 Verify DOUBLE | ⚠️ Needs Verification | MEDIUM |
| Phase 1 | 1.5 Verify Signed Binary | ⚠️ Needs Verification | MEDIUM |
| Phase 2 | 2.1 Implement decodeUB | ❌ Not Started | HIGH |
| Phase 2 | 2.2 Implement decodeSB | ❌ Not Started | HIGH |
| Phase 2 | 2.3 Implement decodeIEEE754 | ❌ Not Started | HIGH |
| Phase 2 | 2.4 Implement decodeDOUBLE | ❌ Not Started | HIGH |
| Phase 2 | 2.5 Implement decodeMIL1750A | ❌ Not Started | HIGH |
| Phase 2 | 2.6 Implement decodeTIMECODE | ❌ Not Started | HIGH |
| Phase 2 | 2.7 Implement decodeDISCRETE | ❌ Not Started | LOW |
| Phase 3 | 3.1 Create Test Suite | ❌ Not Started | HIGH |
| Phase 3 | 3.2 Automated Loopback | ⚠️ Partial | HIGH |
| Phase 4 | 4.1 Overflow/Underflow | ❌ Not Started | MEDIUM |
| Phase 4 | 4.2 Special Values | ❌ Not Started | MEDIUM |
| Phase 4 | 4.3 Bit Alignment | ❌ Not Started | HIGH |
| Phase 5 | 5.1 Missing Formats | ❌ Not Started | LOW |
| Phase 6 | 6.1 Documentation | ❌ Not Started | MEDIUM |
| Phase 6 | 6.2 Test Vectors | ❌ Not Started | LOW |

---

## Recommended Workflow

1. **Start with Phase 1 (Research & Verification)** - Use MCP tools to research standards
2. **Implement Phase 2 (Decoders)** - Create inverse functions for existing encoders
3. **Test with Phase 3 (Integration)** - Run automated loopback tests
4. **Handle Edge Cases (Phase 4)** - Fix issues found during testing
5. **Document Results (Phase 6)** - Add comments and documentation

---

## References

### IRIG 106 Standards
- **IRIG 106-19**: Telemetry Standards (latest version)
- **Chapter 4**: PCM Formats
- **Appendix D**: TMATS Attribute Transfer Standard

### MCP Tools for Research
- Use `mcp_duckduckgo_search` for quick web searches
- Use `mcp_perplexity_perplexity_research` for deep research with citations
- Use `mcp_context7_query-docs` for library documentation

### Standard References
- **IEEE 754**: Standard for Floating-Point Arithmetic
- **MIL-STD-1750A**: Military Standard Floating-Point Arithmetic
- **IRIG Standard**: Inter-Range Instrumentation Group

---

## Notes

- The current implementation relies on JavaScript's built-in Float32Array/Float64Array for IEEE754 encoding, which should be correct by specification
- MIL-STD-1750A and TIMECODE need independent verification against official specs
- Loopback testing is currently incomplete - only checks byte count, not actual values
- Decoders are missing, making true validation impossible
- Use MCP search tools extensively before making changes to ensure compliance with standards

---

**Last Updated**: 2025-02-05
**Status**: Initial TODO list created
**Next Action**: Start with Task 1.1 (Verify MIL-STD-1750A) using MCP search tools
