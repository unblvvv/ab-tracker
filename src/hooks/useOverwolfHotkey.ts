/**
 * Custom hook for managing Overwolf hotkeys
 * Provides utilities for retrieving and listening to hotkey events
 */

import { useEffect, useState, useCallback } from 'react'
import { logger } from '../utils/logger.utils'
import type {
	OverwolfHotkeyResult,
	OverwolfHotkeyEvent,
} from '../types/overwolf.types'

export interface UseOverwolfHotkeyOptions {
	hotkeyName: string
	gameId?: string
	onPressed?: () => void
}

export interface UseOverwolfHotkeyReturn {
	binding: string | null
	isPressed: boolean
	getHotkey: () => void
}

/**
 * Hook for managing Overwolf hotkeys
 * @param options - Hotkey configuration options
 * @returns Hotkey binding and state
 */
export function useOverwolfHotkey(
	options: UseOverwolfHotkeyOptions
): UseOverwolfHotkeyReturn {
	const { hotkeyName, gameId = '5426', onPressed } = options

	const [binding, setBinding] = useState<string | null>(null)
	const [isPressed, setIsPressed] = useState(false)

	// Get hotkey binding
	const getHotkey = useCallback(() => {
		if (!window.overwolf) {
			logger.warn('Overwolf API not available')
			return
		}

		overwolf.settings.hotkeys.get((result: OverwolfHotkeyResult) => {
			if (result.success && result.games) {
				const gameHotkeys = result.games[gameId]
				const hotkey = gameHotkeys?.find(hk => hk.name === hotkeyName)

				if (hotkey && hotkey.binding) {
					setBinding(hotkey.binding)
					logger.debug(`Hotkey retrieved: ${hotkeyName} = ${hotkey.binding}`)
				} else {
					logger.warn(`Hotkey not found: ${hotkeyName}`)
				}
			} else {
				logger.error('Failed to get hotkeys', result.error)
			}
		})
	}, [hotkeyName, gameId])

	// Get hotkey on mount
	useEffect(() => {
		getHotkey()
	}, [getHotkey])

	// Listen for hotkey press events
	useEffect(() => {
		if (!window.overwolf) return

		const handleHotkeyPressed = (event: OverwolfHotkeyEvent) => {
			if (event.name === hotkeyName) {
				logger.debug(`Hotkey pressed: ${hotkeyName}`)
				setIsPressed(true)

				// Call the callback if provided
				if (onPressed) {
					onPressed()
				}

				// Reset pressed state after a short delay
				setTimeout(() => setIsPressed(false), 100)
			}
		}

		overwolf.settings.hotkeys.onPressed.addListener(handleHotkeyPressed)

		return () => {
			overwolf.settings.hotkeys.onPressed.removeListener(handleHotkeyPressed)
		}
	}, [hotkeyName, onPressed])

	return {
		binding,
		isPressed,
		getHotkey,
	}
}
