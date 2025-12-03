/**
 * Service for interacting with the Riot Client API (Live Client Data)
 * https://developer.riotgames.com/docs/lol#game-client-api
 */

import { RIOT_CLIENT_ROUTES } from '../constants/game.constants'
import { logger } from '../utils/logger.utils'
import type { GameStats, ActivePlayerName } from '../types/game.types'

/**
 * Riot Client API service
 * Handles communication with the local League of Legends client
 */
class RiotClientService {
	private static instance: RiotClientService

	private constructor() {}

	static getInstance(): RiotClientService {
		if (!RiotClientService.instance) {
			RiotClientService.instance = new RiotClientService()
		}
		return RiotClientService.instance
	}

	/**
	 * Fetch data from Riot Client API
	 * Note: The Riot Client uses a self-signed certificate, so we need to handle that
	 */
	private async fetchFromClient<T>(url: string): Promise<T> {
		try {
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(
					`Riot Client API error: ${response.status} ${response.statusText}`
				)
			}

			return await response.json()
		} catch (error) {
			logger.error(`Failed to fetch from Riot Client: ${url}`, error)
			throw error
		}
	}

	/**
	 * Check if the game is currently live
	 * @returns true if a game is currently in progress
	 */
	async isGameLive(): Promise<boolean> {
		try {
			const response = await fetch(RIOT_CLIENT_ROUTES.GAME_STATS)
			return response.ok
		} catch {
			return false
		}
	}

	/**
	 * Get game stats (mode, time, etc.)
	 * @returns Game statistics
	 */
	async getGameStats(): Promise<GameStats> {
		logger.debug('Fetching game stats from Riot Client')
		return this.fetchFromClient<GameStats>(RIOT_CLIENT_ROUTES.GAME_STATS)
	}

	/**
	 * Get the active player's summoner name
	 * @returns Active player name with tag
	 */
	async getActivePlayerName(): Promise<ActivePlayerName> {
		logger.debug('Fetching active player name')

		const response = await fetch(RIOT_CLIENT_ROUTES.ACTIVE_PLAYER_NAME)
		const fullName = await response.text()

		// Remove quotes and split by #
		const cleaned = fullName.replace(/"/g, '')
		const [name, tag] = cleaned.split('#')

		return {
			name: name || '',
			tag: tag || '',
			fullName: cleaned,
		}
	}

	/**
	 * Get all game data (comprehensive endpoint)
	 * @returns Complete game data including all players, events, etc.
	 */
	async getAllGameData(): Promise<unknown> {
		logger.debug('Fetching all game data')
		return this.fetchFromClient(RIOT_CLIENT_ROUTES.ALL_GAME_DATA)
	}

	/**
	 * Get list of all players in the current game
	 * @returns Array of player data
	 */
	async getPlayerList(): Promise<unknown[]> {
		logger.debug('Fetching player list')
		return this.fetchFromClient<unknown[]>(RIOT_CLIENT_ROUTES.PLAYER_LIST)
	}

	/**
	 * Get active player data (abilities, stats, etc.)
	 * @returns Active player data
	 */
	async getActivePlayer(): Promise<unknown> {
		logger.debug('Fetching active player data')
		return this.fetchFromClient(RIOT_CLIENT_ROUTES.ACTIVE_PLAYER)
	}

	/**
	 * Get player scores (KDA, CS, etc.)
	 * @param summonerName - Optional summoner name to get specific player score
	 * @returns Player score data
	 */
	async getPlayerScore(summonerName?: string): Promise<unknown> {
		const url = summonerName
			? `${RIOT_CLIENT_ROUTES.PLAYER_SCORES}?summonerName=${encodeURIComponent(summonerName)}`
			: RIOT_CLIENT_ROUTES.PLAYER_SCORES

		logger.debug(`Fetching player score: ${summonerName || 'active player'}`)
		return this.fetchFromClient(url)
	}

	/**
	 * Wait for game to start
	 * Polls the game stats endpoint until the game is live
	 * @param maxAttempts - Maximum number of attempts (default: 60)
	 * @param interval - Interval between attempts in ms (default: 1000)
	 * @returns true if game started, false if timeout
	 */
	async waitForGameStart(
		maxAttempts = 60,
		interval = 1000
	): Promise<boolean> {
		logger.info('Waiting for game to start...')

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const isLive = await this.isGameLive()

			if (isLive) {
				logger.info('Game is live!')
				return true
			}

			await new Promise(resolve => setTimeout(resolve, interval))
		}

		logger.warn('Game start timeout reached')
		return false
	}
}

export const riotClientService = RiotClientService.getInstance()
