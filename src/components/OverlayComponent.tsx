/**
 * OverlayComponent - Main in-game overlay component
 * Displays participant information for both teams with modern, modular architecture
 */

import React, { useMemo } from "react";
import { useOverwolfWindow } from "../hooks/useOverwolfWindow";
import { useGameParticipants } from "../hooks/useGameParticipants";
import { groupParticipantsByTeam } from "../utils/game.utils";
import { WINDOW_NAMES } from "../constants/game.constants";
import { Header } from "./Header/Header";
import { TeamColumn } from "./TeamColumn/TeamColumn";
import { logger } from "../utils/logger.utils";

const OverlayComponent: React.FC = () => {
  // Window controls
  const { minimize } = useOverwolfWindow({
    windowName: WINDOW_NAMES.IN_GAME,
    enableDrag: true,
    dragElementId: "header",
  });

  // Game participants data
  const { participants, isLoading, isGameLive, error } = useGameParticipants({
    enabled: true,
    onGameStart: (participants) => {
      logger.info("Game started!", { participantCount: participants.length });
    },
    onGameEnd: () => {
      logger.info("Game ended!");
    },
  });

  // Group participants by team
  const { team100, team200 } = useMemo(() => {
    return groupParticipantsByTeam(participants);
  }, [participants]);

  // Render loading state
  if (isLoading && participants.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-bg-primary flex flex-col">
        <div className="gradient-bg" />
        <Header onMinimize={minimize} />
        <main className="flex-1 flex flex-col px-5 py-5 overflow-y-auto overflow-x-hidden relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
            <div className="loading-spinner" />
            <p className="text-text-tertiary text-base font-medium m-0 animate-pulse">
              Loading game data...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Render error state
  if (error && !isGameLive) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-bg-primary flex flex-col">
        <div className="gradient-bg" />
        <Header onMinimize={minimize} />
        <main className="flex-1 flex flex-col px-5 py-5 overflow-y-auto overflow-x-hidden relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center p-10">
            <p className="text-error text-lg font-semibold m-0">
              Waiting for game to start...
            </p>
            <span className="text-text-tertiary text-sm italic">{error}</span>
          </div>
        </main>
      </div>
    );
  }

  // Render empty state
  if (!isGameLive || participants.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-bg-primary flex flex-col">
        <div className="gradient-bg" />
        <Header onMinimize={minimize} />
        <main className="flex-1 flex flex-col px-5 py-5 overflow-y-auto overflow-x-hidden relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-10">
            <h2 className="text-2xl font-bold m-0 gradient-text">
              Waiting for game...
            </h2>
            <p className="text-text-tertiary text-base m-0 max-w-md leading-relaxed">
              Start a League of Legends match to see participant information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Render main overlay with teams
  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-primary flex flex-col">
      <div className="gradient-bg" />

      <Header onMinimize={minimize} showHotkey={true} />

      <main className="flex-1 flex flex-col px-5 py-5 overflow-y-auto overflow-x-hidden relative z-10 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-bg-secondary">
        <div className="flex flex-col gap-6 w-full max-w-[1800px] mx-auto">
          <TeamColumn
            teamId={100}
            participants={team100}
            teamName="Blue Team"
          />

          <TeamColumn teamId={200} participants={team200} teamName="Red Team" />
        </div>

        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-2.5 right-2.5 bg-black/80 border border-primary/30 rounded-md px-3 py-2 text-[11px] font-mono text-secondary z-[9999]">
            <p className="m-0">
              Live: {isGameLive ? "✓" : "✗"} | Players: {participants.length} |
              Blue: {team100.length} | Red: {team200.length}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OverlayComponent;
