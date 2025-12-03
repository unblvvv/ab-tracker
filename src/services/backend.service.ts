/**
 * Service for interacting with the backend API
 * Handles fetching account data, match history, and statistics
 */

import { BACKEND_ROUTES } from "../constants/game.constants";
import { logger } from "../utils/logger.utils";
import type { Participant } from "../types/game.types";

export interface BackendAccountResponse {
	puuid: string;
	gameName: string;
	tagLine: string;
	currentGame?: {
		participants: Participant[];
		gameMode: string;
		gameStartTime: number;
		mapId: number;
	};
}

export interface BackendError {
	error: string;
	message: string;
	statusCode: number;
}

/**
 * Backend API service
 * Handles communication with the custom backend server
 */
class BackendService {
	private static instance: BackendService;
	private baseUrl: string;

	private constructor() {
		this.baseUrl = BACKEND_ROUTES.ACCOUNT("", "").split("/account")[0];
	}

	static getInstance(): BackendService {
		if (!BackendService.instance) {
			BackendService.instance = new BackendService();
		}
		return BackendService.instance;
	}

	/**
	 * Generic fetch method with error handling
	 */
	private async fetchFromBackend<T>(url: string): Promise<T> {
		try {
			logger.debug(`Fetching from backend: ${url}`);

			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					error: "Unknown error",
					message: response.statusText,
					statusCode: response.status,
				}));

				logger.error("Backend API error", {
					url,
					status: response.status,
					error: errorData,
				});

				throw new Error(errorData.message || `Backend error: ${response.status}`);
			}

			const data = await response.json();
			logger.debug("Backend response received", { url, dataKeys: Object.keys(data) });

			return data as T;
		} catch (error) {
			logger.error("Failed to fetch from backend", { url, error });
			throw error;
		}
	}

	/**
	 * Get account information by riot ID (name and tag)
	 * @param name - Summoner name (without tag)
	 * @param tag - Summoner tag (without #)
	 * @returns Account information including current game if available
	 */
	async getAccountByRiotId(name: string, tag: string): Promise<BackendAccountResponse> {
		if (!name || !tag) {
			throw new Error("Name and tag are required");
		}

		logger.info(`Fetching account data for: ${name}#${tag}`);

		const url = BACKEND_ROUTES.ACCOUNT(name, tag);
		return this.fetchFromBackend<BackendAccountResponse>(url);
	}

	/**
	 * Get summoner information by summoner ID
	 * @param summonerId - The summoner ID
	 * @returns Summoner information
	 */
	async getSummonerById(summonerId: string): Promise<unknown> {
		if (!summonerId) {
			throw new Error("Summoner ID is required");
		}

		logger.info(`Fetching summoner data: ${summonerId}`);

		const url = BACKEND_ROUTES.SUMMONER(summonerId);
		return this.fetchFromBackend(url);
	}

	/**
	 * Get match information by match ID
	 * @param matchId - The match ID
	 * @returns Match data
	 */
	async getMatchById(matchId: string): Promise<unknown> {
		if (!matchId) {
			throw new Error("Match ID is required");
		}

		logger.info(`Fetching match data: ${matchId}`);

		const url = BACKEND_ROUTES.MATCH(matchId);
		return this.fetchFromBackend(url);
	}

	/**
	 * Check if backend is available
	 * @returns true if backend is reachable
	 */
	async isBackendAvailable(): Promise<boolean> {
		try {
			const response = await fetch(this.baseUrl, {
				method: "HEAD",
				mode: "no-cors",
			});
			return response.ok || response.type === "opaque";
		} catch (error) {
			logger.warn("Backend is not available", error);
			return false;
		}
	}

	/**
	 * Retry a request with exponential backoff
	 * @param fn - Function to retry
	 * @param maxRetries - Maximum number of retries (default: 3)
	 * @param delay - Initial delay in ms (default: 1000)
	 * @returns Result from the function
	 */
	async withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await fn();
			} catch (error) {
				lastError = error as Error;
				logger.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1})`, error);

				if (attempt < maxRetries) {
					const waitTime = delay * Math.pow(2, attempt);
					logger.debug(`Retrying in ${waitTime}ms...`);
					await new Promise((resolve) => setTimeout(resolve, waitTime));
				}
			}
		}

		throw lastError || new Error("Request failed after retries");
	}

	/**
	 * Batch fetch multiple accounts
	 * @param accounts - Array of {name, tag} objects
	 * @returns Array of account data (null for failed requests)
	 */
	async getMultipleAccounts(
		accounts: Array<{ name: string; tag: string }>,
	): Promise<Array<BackendAccountResponse | null>> {
		logger.info(`Fetching ${accounts.length} accounts`);

		const promises = accounts.map(async ({ name, tag }) => {
			try {
				return await this.getAccountByRiotId(name, tag);
			} catch (error) {
				logger.error(`Failed to fetch account: ${name}#${tag}`, error);
				return null;
			}
		});

		return Promise.all(promises);
	}
}

export const backendService = BackendService.getInstance();
