/**
 * Custom hook for fetching and managing game participants data
 * Handles polling game state and fetching participant information
 */

import { useEffect, useState, useCallback } from 'react'
import { logger } from '../utils/logger.utils'
import { riotClientService } from '../services/riotClient.service'
import { backendService } from '../services/backend.service'
import { POLLING_INTERVALS } from '../constants/game.constants'
import type { Participant } from '../types/game.types'

export interface UseGameParticipantsOptions {
	enabled?: boolean
	pollingInterval?: number
	onGameStart?: (participants: Participant[]) => void
	onGameEnd?: () => void
}

export interface UseGameParticipantsReturn {
	participants: Participant[]
	isLoading: boolean
	isGameLive: boolean
	error: string | null
	refetch: () => Promise<void>
	reset: () => void
}

/**
 * Hook for managing game participants data
 * Automatically polls the game state and fetches participant information
 *
 * @param options - Configuration options
 * @returns Participants data and control functions
 */
export function useGameParticipants(
	options: UseGameParticipantsOptions = {}
): UseGameParticipantsReturn {
	const {
		enabled = true,
		pollingInterval = POLLING_INTERVALS.GAME_STATE,
		onGameStart,
		onGameEnd,
	} = options

	const [participants, setParticipants] = useState<Participant[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isGameLive, setIsGameLive] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false)

	/**
	 * Fetch participants data from backend
	 */
	const fetchParticipants = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			// Check if game is live
			const gameLive = await riotClientService.isGameLive()

			if (!gameLive) {
				logger.debug('Game is not live')

				// If game was live before, trigger onGameEnd
				if (isGameLive && onGameEnd) {
					onGameEnd()
				}

				setIsGameLive(false)
				setParticipants([])
				setHasFetchedOnce(false)
				return
			}

			setIsGameLive(true)

			// If we already have participants, don't fetch again
			if (hasFetchedOnce && participants.length > 0) {
				logger.debug('Using cached participants data')
				return
			}

			// Get active player name
			const { name, tag } = await riotClientService.getActivePlayerName()
			logger.info(`Active player: ${name}#${tag}`)

			// Fetch account data from backend (includes current game participants)
			const accountData = await backendService.getAccountByRiotId(name, tag)

			if (accountData?.currentGame?.participants) {
				const newParticipants = accountData.currentGame.participants
				setParticipants(newParticipants)
				setHasFetchedOnce(true)

				logger.info(
					`Fetched ${newParticipants.length} participants`,
					{
						teams: {
							blue: newParticipants.filter(p => p.teamId === 100).length,
							red: newParticipants.filter(p => p.teamId === 200).length,
						},
					}
				)

				// Trigger onGameStart callback
				if (onGameStart && !hasFetchedOnce) {
					onGameStart(newParticipants)
				}
			} else {
				logger.warn('No participants data in backend response')
				setError('No participants data available')
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error'
			logger.error('Failed to fetch participants', err)
			setError(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}, [participants.length, isGameLive, hasFetchedOnce, onGameStart, onGameEnd])

	/**
	 * Reset all state
	 */
	const reset = useCallback(() => {
		setParticipants([])
		setIsLoading(false)
		setIsGameLive(false)
		setError(null)
		setHasFetchedOnce(false)
		logger.debug('Game participants state reset')
	}, [])

	/**
	 * Set up polling interval
	 */
	useEffect(() => {
		if (!enabled) {
			logger.debug('Game participants polling disabled')
			return
		}

		logger.info('Starting game participants polling', { pollingInterval })

		// Initial fetch
		fetchParticipants()

		// Set up polling
		const interval = setInterval(fetchParticipants, pollingInterval)

		return () => {
			logger.info('Stopping game participants polling')
			clearInterval(interval)
		}
	}, [enabled, pollingInterval, fetchParticipants])

	return {
		participants,
		isLoading,
		isGameLive,
		error,
		refetch: fetchParticipants,
		reset,
	}
}
