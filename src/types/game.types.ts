/**
 * Game and participant data types for League of Legends tracker
 */

export interface ChampionAbility {
  q: {
    name: string;
    description: string;
  };
  w: {
    name: string;
    description: string;
  };
  e: {
    name: string;
    description: string;
  };
  r: {
    name: string;
    description: string;
  };
  passive?: {
    name: string;
    description: string;
  };
}

export interface ChampionMastery {
  level: number;
  points: number;
}

export interface RankedInfo {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface MatchStats {
  champion: string;
  kda: string;
  mode: string;
  win: boolean;
}

export interface ChampionStats {
  champion: string;
  winRate: number;
  games: number;
  kda: number;
}

export interface ParticipantStats {
  recentMatches?: MatchStats[];
  topChampions?: ChampionStats[];
  winRate?: number;
  gamesPlayed?: number;
}

export interface Participant {
  summonerName: string;
  championName: string;
  teamId: 100 | 200;
  tier: string;
  rank: string;
  mastery: ChampionMastery;
  ability: ChampionAbility;
  stats?: ParticipantStats;
  puuid?: string;
  summonerId?: string;
}

export interface CurrentGameInfo {
  participants: Participant[];
  gameMode: string;
  gameStartTime: number;
  mapId: number;
}

export interface AccountInfo {
  puuid: string;
  gameName: string;
  tagLine: string;
  currentGame?: CurrentGameInfo;
}

export interface GameStats {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface ActivePlayerName {
  name: string;
  tag: string;
  fullName: string;
}

export type TeamId = 100 | 200;

export interface Team {
  id: TeamId;
  participants: Participant[];
}

export interface GameState {
  isLive: boolean;
  teams: Team[];
  playerTeam: TeamId | null;
}
