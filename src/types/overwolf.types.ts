/**
 * Overwolf API types and interfaces
 */

export interface OverwolfWindow {
	id: string
	name: string
	width: number
	height: number
	top: number
	left: number
	isVisible: boolean
}

export interface OverwolfWindowResult {
	success: boolean
	window: OverwolfWindow
	error?: string
}

export interface OverwolfWindowStateResult {
	success: boolean
	window_state: 'normal' | 'minimized' | 'maximized' | 'closed' | 'hidden'
	window_state_ex: string
	error?: string
}

export interface OverwolfGameInfo {
	id: number
	isRunning: boolean
	isInFocus?: boolean
	title?: string
	width?: number
	height?: number
	logicalWidth?: number
	logicalHeight?: number
	renderers?: string[]
	detectedRenderer?: string
	executionPath?: string
	sessionId?: string
	commandLine?: string
}

export interface OverwolfRunningGameInfo extends OverwolfGameInfo {
	success: boolean
	error?: string
}

export interface OverwolfGameInfoUpdatedEvent {
	gameInfo: OverwolfGameInfo | null
	resolutionChanged?: boolean
	focusChanged?: boolean
	runningChanged?: boolean
	gameChanged?: boolean
}

export interface OverwolfHotkey {
	name: string
	title: string
	binding: string
	passthrough?: boolean
	hold?: boolean
	IsUnassigned?: boolean
	isDefault?: boolean
}

export interface OverwolfHotkeyResult {
	success: boolean
	games?: {
		[gameId: string]: OverwolfHotkey[]
	}
	globals?: OverwolfHotkey[]
	error?: string
}

export interface OverwolfHotkeyEvent {
	name: string
}

export interface OverwolfGameEvent {
	name: string
	data: string | Record<string, unknown>
}

export interface OverwolfInfoUpdate {
	feature: string
	info: Record<string, unknown>
}

export interface OverwolfNewGameEvents {
	events: OverwolfGameEvent[]
}

export type OverwolfCallback<T> = (result: T) => void

declare global {
	interface Window {
		overwolf: {
			windows: {
				obtainDeclaredWindow: (
					windowName: string,
					callback: OverwolfCallback<OverwolfWindowResult>
				) => void
				getCurrentWindow: (
					callback: OverwolfCallback<OverwolfWindowResult>
				) => void
				restore: (windowId: string, callback?: OverwolfCallback<void>) => void
				minimize: (windowId: string, callback?: OverwolfCallback<void>) => void
				hide: (windowId: string, callback?: OverwolfCallback<void>) => void
				close: (windowId: string, callback?: OverwolfCallback<void>) => void
				dragMove: (windowId: string, callback?: OverwolfCallback<void>) => void
				getWindowState: (
					windowId: string,
					callback: OverwolfCallback<OverwolfWindowStateResult>
				) => void
			}
			games: {
				onGameInfoUpdated: {
					addListener: (
						callback: (event: OverwolfGameInfoUpdatedEvent) => void
					) => void
					removeListener: (
						callback: (event: OverwolfGameInfoUpdatedEvent) => void
					) => void
				}
				getRunningGameInfo: (
					callback: OverwolfCallback<OverwolfRunningGameInfo>
				) => void
				events: {
					setRequiredFeatures: (
						features: string[],
						callback: OverwolfCallback<{ success: boolean; error?: string }>
					) => void
					onNewEvents: {
						addListener: (
							callback: (event: OverwolfNewGameEvents) => void
						) => void
						removeListener: (
							callback: (event: OverwolfNewGameEvents) => void
						) => void
					}
					onInfoUpdates2: {
						addListener: (
							callback: (event: OverwolfInfoUpdate) => void
						) => void
						removeListener: (
							callback: (event: OverwolfInfoUpdate) => void
						) => void
					}
				}
			}
			settings: {
				hotkeys: {
					get: (callback: OverwolfCallback<OverwolfHotkeyResult>) => void
					onPressed: {
						addListener: (
							callback: (event: OverwolfHotkeyEvent) => void
						) => void
						removeListener: (
							callback: (event: OverwolfHotkeyEvent) => void
						) => void
					}
				}
			}
		}
	}
}

export {}
