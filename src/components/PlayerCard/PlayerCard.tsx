/**
 * PlayerCard component for displaying individual participant information
 * Shows champion, rank, mastery, stats, and abilities
 */

import React from "react";
import type { Participant } from "../../types/game.types";
import { ASSET_PATHS } from "../../constants/game.constants";
import { formatMasteryPoints, formatRank } from "../../utils/game.utils";

interface PlayerCardProps {
	participant: Participant;
	showAbilities?: boolean;
	showStats?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ participant, showAbilities = true, showStats = true }) => {
	const { summonerName, championName, tier, rank, mastery, ability, stats } = participant;

	return (
		<div className="w-[200px] min-h-[270px] bg-gradient-to-br from-bg-secondary/95 to-bg-primary/95 rounded-xl p-3 shadow-lg transition-all duration-slow relative border border-white/5 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 animate-slide-up">
			{/* Header - Summoner Name */}
			<div className="bg-bg-elevated/80 px-2.5 py-2 rounded-lg mb-3 text-center">
				<span
					className="text-xs font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap block tracking-wide"
					title={summonerName}
				>
					{summonerName || "UNKNOWN"}
				</span>
			</div>

			{/* Champion Info */}
			<div className="flex items-center gap-2.5 mb-3">
				<img
					className="w-[50px] h-[50px] rounded-lg border-2 border-primary/30 object-cover transition-colors duration-base hover:border-primary/60"
					src={ASSET_PATHS.CHAMPION_ICON(championName)}
					alt={championName}
					loading="lazy"
				/>
				<div className="flex-1 flex flex-col gap-1 overflow-hidden">
					<div className="text-xs font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
						{championName}
					</div>
					<div className="text-[9px] text-text-disabled leading-tight">
						{stats?.gamesPlayed ? `${stats.gamesPlayed} games` : "No data"}
					</div>
					<div className="flex items-center gap-1.5 text-[9px]">
						<span className="bg-gradient-to-r from-primary to-secondary px-1.5 py-0.5 rounded text-white font-bold text-[9px]">
							M{mastery.level}
						</span>
						<span className="text-text-tertiary font-semibold">{formatMasteryPoints(mastery.points)}</span>
					</div>
				</div>
			</div>

			{/* Rank Section */}
			<div className="flex items-center gap-2.5 mb-3 p-2 bg-bg-elevated/50 rounded-lg">
				<img
					className="w-[45px] h-[45px] object-contain"
					src={ASSET_PATHS.RANK_ICON(tier)}
					alt={tier}
					onError={(e) => {
						e.currentTarget.src = ASSET_PATHS.RANK_ICON("UNRANKED");
					}}
				/>
				<div className="flex-1 flex flex-col gap-0.5">
					<div className="text-[11px] font-bold text-white leading-tight">{formatRank(tier, rank)}</div>
					<div className="text-[8px] text-text-disabled leading-tight">Ranked Solo/Duo</div>
					{stats?.winRate !== undefined && (
						<div className="text-[9px] text-secondary font-semibold">{(stats.winRate * 100).toFixed(1)}% WR</div>
					)}
				</div>
			</div>

			{/* Main Roles */}
			<div className="text-[9px] mb-3 px-2 py-1.5 bg-bg-elevated/30 rounded-md text-center">
				<span className="text-text-tertiary mr-1">Main Roles:</span>
				<span className="text-white font-semibold">Unknown</span>
			</div>

			{/* Stats Section */}
			{showStats && stats && (
				<div className="flex gap-2 mb-3">
					<div className="flex-1 relative px-1.5 py-2 bg-bg-elevated/50 rounded-md text-center cursor-pointer transition-colors duration-base hover:bg-bg-elevated/70 group">
						<span className="block text-[8px] text-text-tertiary mb-1 uppercase tracking-wider">Recent Games</span>
						<span className="block text-xs font-bold text-white">{stats.recentMatches?.length || 0}</span>
						{stats.recentMatches && stats.recentMatches.length > 0 && (
							<div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-bg-primary/98 border border-primary/40 rounded-lg p-3 min-w-[220px] max-w-[280px] z-[1000] shadow-xl animate-fade-in">
								<h4 className="m-0 mb-2 text-xs text-secondary border-b border-secondary/20 pb-1.5">Recent Matches</h4>
								<ul className="list-none m-0 p-0">
									{stats.recentMatches.slice(0, 5).map((match, i) => (
										<li
											key={i}
											className="flex justify-between items-center py-1.5 text-[10px] border-b border-white/5 last:border-b-0"
										>
											<span className="text-white font-semibold flex-1">{match.champion}</span>
											<span className="text-text-tertiary mx-2">{match.kda}</span>
											<span
												className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${match.win ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}
											>
												{match.win ? "W" : "L"}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<div className="flex-1 relative px-1.5 py-2 bg-bg-elevated/50 rounded-md text-center cursor-pointer transition-colors duration-base hover:bg-bg-elevated/70 group">
						<span className="block text-[8px] text-text-tertiary mb-1 uppercase tracking-wider">Top Champs</span>
						<span className="block text-xs font-bold text-white">{stats.topChampions?.length || 0}</span>
						{stats.topChampions && stats.topChampions.length > 0 && (
							<div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-bg-primary/98 border border-primary/40 rounded-lg p-3 min-w-[220px] max-w-[280px] z-[1000] shadow-xl animate-fade-in">
								<h4 className="m-0 mb-2 text-xs text-secondary border-b border-secondary/20 pb-1.5">Top Champions</h4>
								<ul className="list-none m-0 p-0">
									{stats.topChampions.slice(0, 3).map((champion, i) => (
										<li
											key={i}
											className="flex justify-between items-center py-1.5 text-[10px] border-b border-white/5 last:border-b-0"
										>
											<span className="text-white font-semibold flex-1">{champion.champion}</span>
											<span className="text-secondary mx-1.5 font-semibold">{champion.winRate}%</span>
											<span className="text-text-tertiary">{champion.games}G</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Abilities Section */}
			{showAbilities && ability && (
				<div className="flex justify-between gap-1.5">
					{Object.entries(ability).map(([key, description]) => {
						// Skip passive if not needed
						if (key === "passive") return null;

						return (
							<div key={key} className="relative flex flex-col items-center cursor-pointer group">
								<div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-primary/40 px-1.5 py-0.5 rounded z-10 shadow-sm">
									{key.toUpperCase()}
								</div>
								<img
									className="w-7 h-7 rounded-md border border-primary/30 transition-all duration-base object-cover group-hover:border-primary/80 group-hover:scale-110 group-hover:shadow-glow"
									src={ASSET_PATHS.ABILITY_ICON(championName, key)}
									alt={`${championName} ${key.toUpperCase()}`}
									loading="lazy"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
								{description && (
									<div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-bg-primary/98 border border-primary/40 rounded-lg p-3 w-[260px] z-[1000] shadow-xl animate-fade-in">
										<h4 className="m-0 mb-2 text-xs text-secondary border-b border-secondary/20 pb-1.5">
											{key.toUpperCase()} Ability
										</h4>
										<p className="m-0 text-[10px] leading-relaxed text-text-secondary">{description}</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
