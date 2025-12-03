# AbTracker

**Advanced Ability Tracker for League of Legends** - An Overwolf application that provides real-time information about champions, abilities, and statistics during League of Legends matches.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Overwolf](https://img.shields.io/badge/overwolf-required-purple.svg)

## 🎮 Features

- **Real-time Champion Information**: Display champion details for all players in your match
- **Ability Tracking**: View all champion abilities with descriptions and cooldowns
- **Ranked Statistics**: Shows player rank, mastery level, and win rates
- **Team Organization**: Automatically groups players by team (Blue/Red)
- **Modern UI**: Clean, responsive interface with smooth animations
- **Hotkey Support**: Toggle overlay visibility with customizable hotkeys
- **Auto-detection**: Automatically launches when League of Legends starts

## 🚀 Quick Start

### Prerequisites

- [Overwolf](https://www.overwolf.com/) installed
- League of Legends client
- Node.js 18+ (for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ab-tracker.git
cd ab-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Build the project:
```bash
npm run build
```

4. Load in Overwolf:
   - Open Overwolf
   - Go to Settings → Support → Development Options
   - Click "Load unpacked extension"
   - Select the `dist` folder

## 🏗️ Project Structure

```
ab-tracker/
├── src/
│   ├── components/          # React components
│   │   ├── Header/         # Header component with window controls
│   │   ├── PlayerCard/     # Individual player card component
│   │   ├── TeamColumn/     # Team container component
│   │   └── OverlayComponent.tsx  # Main overlay component
│   ├── constants/          # Application constants
│   │   └── game.constants.ts    # Game IDs, URLs, endpoints
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameParticipants.ts  # Game data fetching hook
│   │   ├── useOverwolfHotkey.ts    # Hotkey management hook
│   │   └── useOverwolfWindow.ts    # Window control hook
│   ├── services/           # API services
│   │   ├── backend.service.ts      # Backend API service
│   │   └── riotClient.service.ts   # Riot Client API service
│   ├── types/              # TypeScript type definitions
│   │   ├── game.types.ts          # Game data types
│   │   └── overwolf.types.ts      # Overwolf API types
│   ├── ui/                 # Overwolf window definitions
│   │   ├── manifest.json          # Overwolf manifest
│   │   └── windows/
│   │       ├── background/        # Background window
│   │       └── in_game/           # In-game overlay window
│   ├── utils/              # Utility functions
│   │   ├── game.utils.ts         # Game-related utilities
│   │   └── logger.utils.ts       # Logging utilities
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # Application entry point
│   └── store.ts            # Redux store configuration
├── public/                 # Static assets
│   ├── img/               # Images and icons
│   └── *.css              # Legacy CSS files
├── dist/                   # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Development Workflow

1. **Hot Reload**: Changes to React components are reflected immediately
2. **TypeScript**: Full TypeScript support with strict type checking
3. **ESLint**: Code quality checks on every build
4. **Vite**: Lightning-fast build and HMR

### Architecture Overview

#### Component Hierarchy

```
OverlayComponent
├── Header
│   └── Window controls + Hotkey display
├── TeamColumn (Blue Team)
│   └── PlayerCard[]
│       ├── Champion Info
│       ├── Rank Display
│       ├── Statistics
│       └── Abilities
└── TeamColumn (Red Team)
    └── PlayerCard[]
```

#### Data Flow

```
Game Launch
    ↓
Background Script (detects game)
    ↓
In-Game Window (opens)
    ↓
useGameParticipants Hook
    ↓
Riot Client API → Active Player Name
    ↓
Backend API → Full Game Data
    ↓
Redux Store → State Management
    ↓
React Components → UI Rendering
```

#### Custom Hooks

- **useGameParticipants**: Manages game state polling and participant data
- **useOverwolfWindow**: Provides window control utilities (drag, minimize, close)
- **useOverwolfHotkey**: Manages hotkey bindings and events

#### Services

- **riotClientService**: Communicates with League Client API (127.0.0.1:2999)
- **backendService**: Fetches extended player data from custom backend

## 🎨 Customization

### Styling

The application uses **Tailwind CSS** for all styling:

- **Utility-first approach** - Classes applied directly in JSX
- **Custom configuration** - Extended Tailwind config in `tailwind.config.js`
- **Custom components** - Reusable component classes in `@layer components`
- **Global styles** - Base styles and utilities in `src/index.css`
- **Responsive design** - Mobile-first breakpoints
- **Dark theme** - Custom color palette for gaming UI

### Constants

Modify game-related constants in `src/constants/game.constants.ts`:

```typescript
export const POLLING_INTERVALS = {
  GAME_STATE: 5000,      // How often to check game state
  STATS_UPDATE: 1000,    // Stats update frequency
  ABILITY_COOLDOWN: 100, // Ability cooldown check
}
```

### Theme Colors

Primary colors are defined in Tailwind config:

- Blue Team: `#48bdff` (`team-blue`)
- Red Team: `#ff4848` (`team-red`)
- Primary Accent: `#6248ff` (`primary`)
- Secondary: `#48bdff` (`secondary`)
- Background: `#121212` (`bg-primary`)

All colors are available as Tailwind utilities (e.g., `bg-primary`, `text-team-blue`, `border-secondary/30`)

## 🔧 Configuration

### Tailwind CSS

Configure theme and extend utilities in `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6248ff',
        team: {
          blue: '#48bdff',
          red: '#ff4848',
        },
        // ... more colors
      },
    },
  },
}
```

### Overwolf Manifest

Key configuration in `src/ui/manifest.json`:

```json
{
  "game_targeting": {
    "type": "dedicated",
    "game_ids": [5426, 10902]  // LoL + LoL PBE
  },
  "hotkeys": {
    "show_hide_in_game": {
      "title": "Toggle in-game window",
      "default": "Ctrl+G"
    }
  }
}
```

### Window Settings

In-game overlay window configuration:

```json
{
  "size": {
    "width": 1212,
    "height": 699
  },
  "transparent": true,
  "resizable": true
}
```

## 📝 API Documentation

### Riot Client API

Local League of Legends client API endpoints:

- `GET /liveclientdata/gamestats` - Game statistics
- `GET /liveclientdata/activeplayername` - Active player name
- `GET /liveclientdata/allgamedata` - Complete game data

### Backend API

Custom backend endpoints (requires separate backend service):

- `GET /account/:name/:tag` - Account info with current game
- `GET /summoner/:summonerId` - Summoner details
- `GET /match/:matchId` - Match history

## 🐛 Troubleshooting

### Common Issues

**Overlay not appearing:**
- Check if Overwolf is running
- Verify League of Legends is detected
- Check hotkey bindings in Overwolf settings

**No participant data:**
- Ensure backend service is running on `localhost:8080`
- Check browser console for API errors
- Verify game is in progress (not in lobby)

**Performance issues:**
- Reduce polling interval in settings
- Disable animations for better performance
- Check for console errors

### Debug Mode

Enable debug mode in development:

```typescript
// In OverlayComponent.tsx
{import.meta.env.DEV && (
  <div className="overlay-debug">
    {/* Debug info displayed here */}
  </div>
)}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Add JSDoc comments for functions
- Use meaningful variable names
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Overwolf](https://www.overwolf.com/) - Application platform
- [Community Dragon](https://communitydragon.org/) - Champion assets
- [Riot Games](https://www.riotgames.com/) - League of Legends API

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Join our Discord community

## 🗺️ Roadmap

- [ ] Live ability cooldown tracking
- [ ] Multi-language support
- [ ] Custom themes
- [ ] Performance analytics
- [ ] Replay system integration
- [ ] Voice communication integration
- [ ] Mobile companion app

---

**Built with ❤️ for the League of Legends community**