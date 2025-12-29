<<<<<<< HEAD
# Tetris - Portrait Arcade UI

A modern, portrait-oriented Tetris game UI built with React and TypeScript, featuring a dark blue arcade theme with card-based design.

## 🎮 Game Overview

Tetris is a classic puzzle game where players arrange falling tetromino pieces to create complete horizontal lines. When a line is filled, it disappears, and the player earns points. The game gets progressively faster as the level increases.

### Key Features

- **Portrait Mobile-First Design**: Optimized for portrait orientation with a phone-like frame
- **Dark Blue Arcade Theme**: High-contrast, card-based UI with modern styling
- **3D Block Effects**: Puffy, dimensional blocks with highlights and shadows
- **Ghost Piece Preview**: Shows where the current piece will land
- **Hold & Next Panels**: Preview upcoming pieces and hold one for later use
- **Responsive Layout**: Works on mobile and desktop (centered container)

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── GameFrame.tsx    # Main container with phone-like frame
│   ├── TopStatusBar.tsx # Lines/Level/Score cards
│   ├── MainArea.tsx     # Hold/Playfield/Next layout
│   ├── Playfield.tsx    # 10×20 game board
│   ├── HoldPanel.tsx    # Hold piece display
│   ├── NextPanel.tsx    # Next pieces preview
│   └── ...
├── hooks/               # Custom Hooks
│   ├── useGameState.ts  # Game state management
│   ├── useFormatNumber.ts # Number formatting
│   └── useTetromino.ts  # Tetromino utilities
├── types.ts             # TypeScript type definitions
├── mockData.ts          # Mock game data for UI
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Game Controls

### Basic Controls
- **Move Left/Right**: Move the falling piece horizontally
- **Move Down**: Soft drop (accelerate downward)
- **Rotate**: Rotate the piece clockwise/counterclockwise
- **Hard Drop**: Instantly drop to bottom
- **Hold**: Store current piece for later use

### Game Elements

#### Status Bar (Top)
- **LINES**: Total lines cleared
- **LEVEL**: Current level (affects speed)
- **SCORE**: Current score with top score indicator

#### Main Area
- **HOLD Panel**: Shows held piece (left)
- **Playfield**: 10×20 game board (center)
- **NEXT Panel**: Shows 4 upcoming pieces (right)

## 🧩 Tetromino Types

The game features 7 different tetromino shapes:

- **I** (Cyan): 4-block line - perfect for Tetris (4-line clear)
- **O** (Yellow): 2×2 square - stable, can't rotate
- **T** (Purple): T-shape - versatile for filling gaps
- **S** (Green): S-shape
- **Z** (Red): Z-shape
- **J** (Blue): J-shape
- **L** (Orange): L-shape

## 📊 Scoring System

- **1 line**: 100 × level
- **2 lines**: 300 × level
- **3 lines**: 500 × level
- **4 lines (Tetris)**: 800 × level
- **Soft drop**: 1 point per cell
- **Hard drop**: 2 points per cell

## 🎨 Design Features

### Visual Style
- Dark blue gradient backgrounds
- Bright blue borders on cards
- 3D block effects with highlights/shadows
- High contrast typography
- Tabular numbers for consistent digit width
- Subtle grid lines on playfield

### Layout Proportions
- Top Status Bar: ~10-12% of viewport
- Main Game Area: ~75-80%
- Bottom Safe Area: ~8-12%

## 🛠️ Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS3**: Styling with gradients, shadows, and animations

## 📝 Development Notes

### Current State
- ✅ UI implementation complete
- ✅ Mock data integration
- ✅ Responsive design
- ⏳ Game logic (to be connected)

### Architecture
The UI is separated from game logic, making it easy to connect a game engine later:
- Components handle rendering only
- Hooks manage state and utilities
- Types ensure type safety
- Mock data provides sample game state

## 🎯 Future Enhancements

- [ ] Connect game engine
- [ ] Add touch controls for mobile
- [ ] Implement pause/restart functionality
- [ ] Add sound effects
- [ ] High score persistence
- [ ] Game over overlay
- [ ] Settings panel

## 📄 License

This project is for educational purposes.

---

For detailed game instructions, see [GAME_GUIDE.md](./GAME_GUIDE.md)
