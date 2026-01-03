/**
 * Game and application constants
 */

// League of Legends game IDs
export const GAME_IDS = {
  LOL: 5426,
  LOL_PBE: 10902,
} as const;

// All supported game IDs
export const SUPPORTED_GAME_IDS = [GAME_IDS.LOL, GAME_IDS.LOL_PBE] as const;

// Team IDs in League of Legends
export const TEAM_IDS = {
  BLUE: 100,
  RED: 200,
} as const;

// Overwolf window names
export const WINDOW_NAMES = {
  BACKGROUND: "background",
  IN_GAME: "in_game",
  DESKTOP: "desktop",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  RIOT_CLIENT: "https://127.0.0.1:2999/liveclientdata",
  BACKEND: "http://localhost:8080",
} as const;

// Riot Client API routes
export const RIOT_CLIENT_ROUTES = {
  GAME_STATS: `${API_ENDPOINTS.RIOT_CLIENT}/gamestats`,
  ACTIVE_PLAYER_NAME: `${API_ENDPOINTS.RIOT_CLIENT}/activeplayername`,
  ALL_GAME_DATA: `${API_ENDPOINTS.RIOT_CLIENT}/allgamedata`,
  PLAYER_LIST: `${API_ENDPOINTS.RIOT_CLIENT}/playerlist`,
  ACTIVE_PLAYER: `${API_ENDPOINTS.RIOT_CLIENT}/activeplayer`,
  PLAYER_SCORES: `${API_ENDPOINTS.RIOT_CLIENT}/playerscore`,
} as const;

// Backend API routes
export const BACKEND_ROUTES = {
  ACCOUNT: (name: string, tag: string) =>
    `${API_ENDPOINTS.BACKEND}/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
  SUMMONER: (summonerId: string) =>
    `${API_ENDPOINTS.BACKEND}/summoner/${summonerId}`,
  MATCH: (matchId: string) => `${API_ENDPOINTS.BACKEND}/match/${matchId}`,
} as const;

// Hotkey names
export const HOTKEY_NAMES = {
  SHOW_HIDE_IN_GAME: "show_hide_in_game",
} as const;

// Required Overwolf features for League of Legends
export const REQUIRED_FEATURES = ["summoner_info", "match_info"] as const;

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  GAME_STATE: 60000, // 60 seconds
  STATS_UPDATE: 5000, // 5 seconds
  ABILITY_COOLDOWN: 1000, // 1 second
} as const;

// CDN URLs
export const CDN_URLS = {
  DATA_DRAGON: "https://ddragon.leagueoflegends.com/cdn",
  DATA_DRAGON_VERSION: "15.24.1",
} as const;

// Asset paths
export const ASSET_PATHS = {
  CHAMPION_ICON: (championName: string) =>
    `${CDN_URLS.DATA_DRAGON}/${CDN_URLS.DATA_DRAGON_VERSION}/img/champion/${championName}.png`,
  ABILITY_ICON: (abilityName: string) =>
    `${CDN_URLS.DATA_DRAGON}/${CDN_URLS.DATA_DRAGON_VERSION}/img/spell/${abilityName}.png`,
  RANK_ICON: (tier: string) => `../../public/img/ranks/${tier}.png`,
  SUMMONER_SPELL: (spellName: string) =>
    `${CDN_URLS.DATA_DRAGON}/${CDN_URLS.DATA_DRAGON_VERSION}/img/spell/${spellName}.png`,
} as const;

// Rank tiers
export const RANK_TIERS = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
] as const;

// Rank divisions
export const RANK_DIVISIONS = ["IV", "III", "II", "I"] as const;

// Ability keys
export const ABILITY_KEYS = ["q", "w", "e", "r", "passive"] as const;

// Game modes
export const GAME_MODES = {
  CLASSIC: "CLASSIC",
  ARAM: "ARAM",
  ARENA: "CHERRY",
  URF: "URF",
  ONE_FOR_ALL: "ONEFORALL",
} as const;
