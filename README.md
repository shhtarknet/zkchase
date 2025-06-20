# ZKChase - Architecture & Circuit Overview

## Introduction

ZKChase is a battle royale game where players move on a grid to hunt and eliminate each other. Players are visible in open areas but can hide in bushes using zero-knowledge proofs to move secretly. The game leverages zero-knowledge circuits for privacy-preserving movement, with smart contracts orchestrating game logic, state, and verification.

---

## Game Mechanics

### Grid System

- **Grid Size**: 18 columns × 14 rows (252 total cells)
- **Position Encoding**: Positions are compressed into a single `Field` value: `(x + y * 256)`
- **Map Representation**: The map is stored in two `U128` values (`map0`, `map1`) that mark movement positions (bushes)

### Movement System

- **Directions**: Four possible moves:
    - Up (y + 1)
    - Down (y - 1)
    - Left (x - 1)
    - Right (x + 1)

### Privacy Model

- **Public**: Game map, previous position hash, new position hash
- **Private**: Actual positions, moves, salt values
- **Verification**: The Cairo (Starknet) contract can verify moves using hashes and proofs, without knowing the exact player positions

---

## Circuit Flow (Bush Movement)

1. **Verify previous position**: Check `hash(prev_pos, salt) == prev_pos_hash`
2. **Calculate new position**: Apply move to get new (x, y)
3. **Validate move**: Ensure new position is a bush (`map_bit() == 1`)
4. **Output new hash**: Return `hash(new_pos, salt)` for next round

> _Note: This circuit only handles hidden (bush-to-bush) movement. Open area moves are handled directly by the contract with full visibility._

---

## ZK Architecture

### Key Functions
- `hash()`: Custom hash with salt for position privacy
- `make_move()`: Applies directional movement
- `map_bit()`: Checks if position is valid on compressed map
- `compress_position()`/`expand_position()`: Convert between (x,y) and Field

### Map Storage
The 252-cell map is compressed into two `U128` values (`map0`, `map1`) where each bit represents a valid/invalid position.

### Privacy Model
- **Open Areas**: Full visibility - all players can see positions and moves
- **Bushes**: Hidden movement using ZK proofs
  - **Public**: Map, position hashes, proof of valid move
  - **Private**: Actual positions, moves, salt
  - **Result**: Prove valid bush-to-bush movement without revealing location
- **Dual System**: Same game logic runs in both contract (open) and circuit (hidden)

### Core Functions

#### `hash(val: Field, salt: Field) -> Field`
Custom hash function that combines a value with a salt using multiple mathematical operations and pre-defined salt constants.

**Algorithm**:
1. Multiplies input by first salt constant
2. Applies series of exponentiations (cubic, 5th power, 7th power, etc.)
3. Combines with additional salt values at each step
4. Returns final hash value

**Security Features**:
- Uses 8 hardcoded salt constants for added security
- Multiple exponentiation rounds prevent reverse engineering
- Salt parameter adds randomness

#### `expand_position(position: Field) -> (u8, u8)`
Decompresses a position field into x,y coordinates.
- Converts field to 2-byte representation
- Returns (x, y) tuple

#### `compress_position(x: u8, y: u8) -> Field`
Compresses x,y coordinates into a single field value.
- Formula: `x + y * 256`

#### `make_move(prev_pos: Field, move: u8) -> (u8, u8)`
Calculates new position based on previous position and move direction.
- Validates move is between 1-4
- Returns new (x, y) coordinates
- Asserts on invalid moves

#### `map_bit(map0: U128, map1: U128, x: u8, y: u8) -> u8`
Retrieves the bit value at position (x,y) from the compressed map representation.

**Implementation Details**:
- Calculates bit index: `y * COLS + x`
- Handles map split across two `U128` values
- Uses bit manipulation to extract specific position
- Returns 1 if position is valid (bush), 0 otherwise

---

## Smart Contract Architecture

The ZKChase smart contracts are organized around three core concepts:

### 1. Models

Models define the core data structures representing the game’s state and entities.

- **Location:** `contracts/src/models`
- **Purpose:** Represent players, game state, and in-game objects.
- **Examples:**
    - `Player`: Player identity, position, status, etc.
    - `GameState`: Current round, player list, eliminations.
    - `ChaseObject`: In-game items, obstacles, or tokens.

### 2. Components

Components are modular attributes or features that can be attached to models/entities.

- **Location:** `contracts/src/components`
- **Purpose:** Add properties like position, score, or ownership to entities.
- **Examples:**
    - `PositionComponent`: Stores positions.
    - `ScoreComponent`: Tracks player scores.
    - `OwnershipComponent`: Manages asset or player ownership.

### 3. Systems

Systems are contracts implementing the core game logic and rules.

- **Location:** `contracts/src/systems`
- **Purpose:** Execute movement, scoring, eliminations, and ZK verification.
- **Examples:**
    - `MovementSystem`: Handles player movement and updates.
    - `ScoringSystem`: Updates scores, handles eliminations.
    - `ProofVerificationSystem`: Verifies zero-knowledge proofs for bush movement.

---

## How it Fits Together

- **Models** are the nouns (e.g., Player, Game).
- **Components** are the adjectives (e.g., position, score).
- **Systems** are the verbs (e.g., move, score, verify).

> The contracts and circuits collectively enable a privacy-preserving, on-chain battle royale, with open and hidden movement seamlessly integrated.

---

For more details, see the [contracts/src directory](https://github.com/shhtarknet/zkchase/tree/8f4341c6f1780ce76c581c0fb834c1a9b8838ecc/contracts/src).
