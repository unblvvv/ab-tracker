/**
 * Custom hook for fetching and managing game participants data
 * Handles polling game state and fetching participant information
 */

import { useEffect, useState, useCallback } from "react";
import { logger } from "../utils/logger.utils";
import { riotClientService } from "../services/riotClient.service";
import { backendService } from "../services/backend.service";
import { POLLING_INTERVALS } from "../constants/game.constants";
import type { Participant } from "../types/game.types";

const MAX_ERROR_COUNT = 3;
const BACKOFF_MULTIPLIER = 2;

export interface UseGameParticipantsOptions {
	enabled?: boolean;
	pollingInterval?: number;
	onGameStart?: (participants: Participant[]) => void;
	onGameEnd?: () => void;
}

export interface UseGameParticipantsReturn {
	participants: Participant[];
	isLoading: boolean;
	isGameLive: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	reset: () => void;
}

/**
 * Hook for managing game participants data
 * Automatically polls the game state and fetches participant information
 *
 * @param options - Configuration options
 * @returns Participants data and control functions
 */
export function useGameParticipants(options: UseGameParticipantsOptions = {}): UseGameParticipantsReturn {
	const { enabled = true, pollingInterval = POLLING_INTERVALS.GAME_STATE, onGameStart, onGameEnd } = options;

	const [participants, setParticipants] = useState<Participant[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isGameLive, setIsGameLive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
	const [errorCount, setErrorCount] = useState(0);
	const [currentPollingInterval, setCurrentPollingInterval] = useState(pollingInterval);

	/**
	 * Fetch participants data from backend
	 */
	const fetchParticipants = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true);

			// Check if game is live
			const gameLive = await riotClientService.isGameLive();

			if (!gameLive) {
				logger.debug("Game is not live");

				// If game was live before, trigger onGameEnd
				if (isGameLive && onGameEnd) {
					onGameEnd();
				}

				setIsGameLive(false);
				setParticipants([]);
				setHasFetchedOnce(false);
				setErrorCount(0);
				setCurrentPollingInterval(pollingInterval);
				setError(null);
				return;
			}

			setIsGameLive(true);

			// If we already have participants, don't fetch again
			if (hasFetchedOnce && participants.length > 0) {
				logger.debug("Using cached participants data");
				setError(null);
				setErrorCount(0);
				setCurrentPollingInterval(pollingInterval);
				return;
			}

			// Get active player name
			const { name, tag } = await riotClientService.getActivePlayerName();
			logger.info(`Active player: ${name}#${tag}`);

			// Fetch account data from backend (includes current game participants)
			const accountData = await backendService.getAccountByRiotId(name, tag);

			if (accountData?.currentGame?.participants) {
				const newParticipants = accountData.currentGame.participants;
				setParticipants(newParticipants);
				setHasFetchedOnce(true);
				setError(null);
				setErrorCount(0);
				setCurrentPollingInterval(pollingInterval);

				logger.info(`Fetched ${newParticipants.length} participants`, {
					teams: {
						blue: newParticipants.filter((p) => p.teamId === 100).length,
						red: newParticipants.filter((p) => p.teamId === 200).length,
					},
				});

				// Trigger onGameStart callback
				if (onGameStart && !hasFetchedOnce) {
					onGameStart(newParticipants);
				}
			} else {
				logger.warn("No participants data in backend response");
				const newError = "No participants data available";
				setError(newError);
				setErrorCount((prev) => prev + 1);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			const newErrorCount = errorCount + 1;

			setErrorCount(newErrorCount);
			setError(errorMessage);

			// Increase polling interval on consecutive errors (exponential backoff)
			if (newErrorCount >= MAX_ERROR_COUNT) {
				const newInterval = Math.min(
					pollingInterval * Math.pow(BACKOFF_MULTIPLIER, newErrorCount - MAX_ERROR_COUNT),
					60000, // Max 60 seconds
				);
				setCurrentPollingInterval(newInterval);
				logger.warn(`Multiple errors detected (${newErrorCount}), increasing polling interval to ${newInterval}ms`);
			}

			logger.error(`Failed to fetch participants (attempt ${newErrorCount})`, err);
		} finally {
			setIsLoading(false);
		}
	}, [participants.length, isGameLive, hasFetchedOnce, errorCount, pollingInterval, onGameStart, onGameEnd]);

	/**
	 * Reset all state
	 */
	const reset = useCallback(() => {
		setParticipants([]);
		setIsLoading(false);
		setIsGameLive(false);
		setError(null);
		setHasFetchedOnce(false);
		logger.debug("Game participants state reset");
	}, []);

	/**
	 * Set up polling interval
	 */
	useEffect(() => {
		if (!enabled) {
			logger.debug("Game participants polling disabled");
			return;
		}

		logger.info("Starting game participants polling", {
			pollingInterval: currentPollingInterval,
			errorCount,
		});

		// Initial fetch
		fetchParticipants();

		// Set up polling with current interval (may be increased due to errors)
		const interval = setInterval(fetchParticipants, currentPollingInterval);

		return () => {
			logger.info("Stopping game participants polling");
			clearInterval(interval);
		};
	}, [enabled, currentPollingInterval, fetchParticipants, errorCount]);

	return {
		participants,
		isLoading,
		isGameLive,
		error,
		refetch: fetchParticipants,
		reset,
	};
}
