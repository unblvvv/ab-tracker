/**
 * Utility functions for game-related operations
 */

import { GAME_IDS, TEAM_IDS } from "../constants/game.constants";
import type { Participant, Team, TeamId } from "../types/game.types";

/**
 * Check if a game ID belongs to League of Legends
 * @param gameId - The Overwolf game ID
 * @returns true if the game is LoL or LoL PBE
 */
export function isLeagueOfLegends(gameId: number): boolean {
  const baseId = Math.floor(gameId / 10);
  return baseId === GAME_IDS.LOL || baseId === GAME_IDS.LOL_PBE;
}

/**
 * Parse summoner name into name and tag
 * @param fullName - Full summoner name (e.g., "PlayerName#TAG")
 * @returns Object with name and tag
 */
export function parseSummonerName(fullName: string): {
  name: string;
  tag: string;
} {
  const cleaned = fullName.replace(/"/g, "");
  const parts = cleaned.split("#");

  return {
    name: parts[0] || "",
    tag: parts[1] || "",
  };
}

/**
 * Group participants by team
 * @param participants - Array of participants
 * @returns Object with teams grouped by team ID
 */
export function groupParticipantsByTeam(participants: Participant[]): {
  team100: Participant[];
  team200: Participant[];
} {
  return {
    team100: participants.filter((p) => p.teamId === TEAM_IDS.BLUE),
    team200: participants.filter((p) => p.teamId === TEAM_IDS.RED),
  };
}

/**
 * Get team data with metadata
 * @param participants - Array of participants
 * @returns Array of Team objects
 */
export function getTeams(participants: Participant[]): Team[] {
  const { team100, team200 } = groupParticipantsByTeam(participants);

  return [
    {
      id: TEAM_IDS.BLUE as TeamId,
      participants: team100,
    },
    {
      id: TEAM_IDS.RED as TeamId,
      participants: team200,
    },
  ];
}

/**
 * Format mastery points for display
 * @param points - Mastery points
 * @returns Formatted string (e.g., "123.4k" or "1.2M")
 */
export function formatMasteryPoints(points: number): string {
  if (points >= 1_000_000) {
    return `${(points / 1_000_000).toFixed(1)}M`;
  }
  if (points >= 1_000) {
    return `${(points / 1_000).toFixed(1)}k`;
  }
  return points.toString();
}

/**
 * Format win rate percentage
 * @param wins - Number of wins
 * @param losses - Number of losses
 * @returns Formatted percentage string
 */
export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return "0%";

  const winRate = (wins / total) * 100;
  return `${winRate.toFixed(1)}%`;
}

/**
 * Calculate KDA ratio
 * @param kills - Number of kills
 * @param deaths - Number of deaths
 * @param assists - Number of assists
 * @returns KDA ratio as a number
 */
export function calculateKDA(
  kills: number,
  deaths: number,
  assists: number,
): number {
  if (deaths === 0) {
    return kills + assists;
  }
  return parseFloat(((kills + assists) / deaths).toFixed(2));
}

/**
 * Format KDA for display
 * @param kills - Number of kills
 * @param deaths - Number of deaths
 * @param assists - Number of assists
 * @returns Formatted KDA string
 */
export function formatKDA(
  kills: number,
  deaths: number,
  assists: number,
): string {
  return `${kills}/${deaths}/${assists}`;
}

/**
 * Get rank display name
 * @param tier - Rank tier (e.g., "GOLD")
 * @param rank - Rank division (e.g., "II")
 * @returns Formatted rank string
 */
export function formatRank(tier: string, rank: string): string {
  // Handle unranked players
  if (!tier || !rank) {
    return "Unranked";
  }

  // Special handling for Master+
  if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier)) {
    return tier.charAt(0) + tier.slice(1).toLowerCase();
  }

  return `${tier.charAt(0)}${tier.slice(1).toLowerCase()} ${rank}`;
}

/**
 * Safely get ability description
 * @param abilities - Champion abilities object
 * @param key - Ability key (q, w, e, r, passive)
 * @returns Ability description or empty string
 */
export function getAbilityDescription(
  abilities: Record<string, string>,
  key: string,
): string {
  return abilities[key] || "No description available";
}

/**
 * Validate if participant data is complete
 * @param participant - Participant object
 * @returns true if all required fields are present
 */
export function isValidParticipant(participant: Partial<Participant>): boolean {
  return !!(
    participant.summonerName &&
    participant.championName &&
    participant.teamId &&
    participant.tier &&
    participant.rank &&
    participant.mastery &&
    participant.ability
  );
}

/**
 * Get game duration in MM:SS format
 * @param seconds - Game time in seconds
 * @returns Formatted time string
 */
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Adapt old ability format to new format for backward compatibility
 * Converts string descriptions to {name, description} objects
 * @param ability - Ability data (old or new format)
 * @param championName - Champion name for generating ability names
 * @returns Ability data in new format
 */
export function adaptAbilityData(
  ability:
    | Record<string, string | { name: string; description: string }>
    | {
        q: string | { name: string; description: string };
        w: string | { name: string; description: string };
        e: string | { name: string; description: string };
        r: string | { name: string; description: string };
        p?: string;
        passive?: string | { name: string; description: string };
      },
  championName: string,
): {
  q: { name: string; description: string };
  w: { name: string; description: string };
  e: { name: string; description: string };
  r: { name: string; description: string };
  passive?: { name: string; description: string };
} {
  console.log("[adaptAbilityData] Input:", { ability, championName });

  // Check if already in new format
  if ("q" in ability && typeof ability.q === "object" && "name" in ability.q) {
    console.log("[adaptAbilityData] Already in new format");
    return ability as {
      q: { name: string; description: string };
      w: { name: string; description: string };
      e: { name: string; description: string };
      r: { name: string; description: string };
      passive?: { name: string; description: string };
    };
  }

  console.log("[adaptAbilityData] Converting old format to new format");

  // Convert old format to new format
  // Generate ability names based on champion name
  const abilityKeys = ["Q", "W", "E", "R"];
  const result: Record<string, { name: string; description: string }> = {};
  const abilityData = ability as Record<
    string,
    string | { name: string; description: string }
  >;

  abilityKeys.forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (abilityData[lowerKey] && typeof abilityData[lowerKey] === "string") {
      result[lowerKey] = {
        name: `${championName}${key}`,
        description: abilityData[lowerKey] as string,
      };
      console.log(
        `[adaptAbilityData] Generated ability: ${lowerKey} -> ${championName}${key}`,
      );
    }
  });

  // Handle passive
  if (abilityData.p || abilityData.passive) {
    result.passive = {
      name: `${championName}_Passive`,
      description: (abilityData.p || abilityData.passive) as string,
    };
    console.log(
      `[adaptAbilityData] Generated passive: ${championName}_Passive`,
    );
  }

  console.log("[adaptAbilityData] Result:", result);

  return result as {
    q: { name: string; description: string };
    w: { name: string; description: string };
    e: { name: string; description: string };
    r: { name: string; description: string };
    passive?: { name: string; description: string };
  };
}
