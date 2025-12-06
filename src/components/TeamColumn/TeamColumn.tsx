/**
 * TeamColumn component for displaying team participants
 * Groups and displays all players from a single team
 */

import React from "react";
import type { Participant, TeamId } from "../../types/game.types";
import { PlayerCard } from "../PlayerCard/PlayerCard";

interface TeamColumnProps {
  teamId: TeamId;
  participants: Participant[];
  teamName?: string;
  className?: string;
}

export const TeamColumn: React.FC<TeamColumnProps> = ({
  teamId,
  participants,
  className = "",
}) => {
  const isBlueTeam = teamId === 100;

  return (
    <div
      className={`flex flex-col gap-4 p-3 bg-bg-primary/50 rounded-xl min-w-[600px] ${
        isBlueTeam
          ? "border-2 border-team-blue/40 bg-gradient-to-br from-team-blue/5 to-bg-primary/50"
          : "border-2 border-team-red/40 bg-gradient-to-br from-team-red/5 to-bg-primary/50"
      } ${isBlueTeam ? "animate-slide-up" : "animate-slide-up [animation-delay:100ms]"} ${className}`}
    >
      {/* Team Players */}
      <div className="flex flex-wrap gap-4 items-start">
        {participants.length === 0 ? (
          <div className="w-full py-10 px-5 text-center text-text-disabled text-sm">
            <p className="m-0">No players found</p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <PlayerCard
              key={participant.puuid || `${participant.summonerName}-${index}`}
              participant={participant}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TeamColumn;
