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

export const TeamColumn: React.FC<TeamColumnProps> = ({ teamId, participants, teamName, className = "" }) => {
	const displayName = teamName || (teamId === 100 ? "Blue Team" : "Red Team");
	const isBlueTeam = teamId === 100;

	return (
		<div
			className={`flex flex-col gap-4 p-4 bg-bg-primary/50 rounded-xl min-w-[600px] ${
				isBlueTeam
					? "border border-team-blue/30 bg-gradient-to-br from-team-blue/5 to-bg-primary/50"
					: "border border-team-red/30 bg-gradient-to-br from-team-red/5 to-bg-primary/50"
			} ${isBlueTeam ? "animate-slide-up" : "animate-slide-up [animation-delay:100ms]"} ${className}`}
		>
			{/* Team Header */}
			<div
				className={`flex items-center justify-between px-4 py-3 bg-bg-elevated/60 rounded-lg border-l-4 ${
					isBlueTeam ? "border-l-team-blue shadow-glow-blue" : "border-l-team-red shadow-glow-red"
				}`}
			>
				<h2
					className={`text-base font-bold m-0 tracking-wider uppercase ${
						isBlueTeam ? "text-team-blue text-shadow" : "text-team-red text-shadow"
					}`}
					style={{
						textShadow: isBlueTeam ? "0 0 10px rgba(72, 189, 255, 0.3)" : "0 0 10px rgba(255, 72, 72, 0.3)",
					}}
				>
					{displayName}
				</h2>
				<span className="text-xs text-text-tertiary font-semibold px-2.5 py-1 bg-white/5 rounded-full">
					{participants.length} players
				</span>
			</div>

			{/* Team Players */}
			<div className="flex flex-wrap gap-4 items-start">
				{participants.length === 0 ? (
					<div className="w-full py-10 px-5 text-center text-text-disabled text-sm">
						<p className="m-0">No players found</p>
					</div>
				) : (
					participants.map((participant, index) => (
						<PlayerCard key={participant.puuid || `${participant.summonerName}-${index}`} participant={participant} />
					))
				)}
			</div>
		</div>
	);
};

export default TeamColumn;
