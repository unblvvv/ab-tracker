/**
 * Background window script for Overwolf
 * Manages game detection, window lifecycle, and hotkey handling
 */

/// <reference types="@overwolf/types" />

import { WINDOW_NAMES, HOTKEY_NAMES } from "../../../constants/game.constants";
import { logger } from "../../../utils/logger.utils";

/**
 * Check if a game ID belongs to League of Legends
 */
function isLeagueOfLegends(gameId: number): boolean {
	const baseId = Math.floor(gameId / 10);
	return baseId === 5426 || baseId === 10902;
}

/**
 * Application state
 */
interface AppState {
	isManuallyHidden: boolean;
	inGameWindowId: string | null;
	isInitialized: boolean;
}

const state: AppState = {
	isManuallyHidden: false,
	inGameWindowId: null,
	isInitialized: false,
};

/**
 * Initialize the background window
 */
function initialize(): void {
	if (state.isInitialized) {
		logger.warn("Background window already initialized");
		return;
	}

	logger.info("Initializing background window...");

	// Get in-game window reference
	obtainInGameWindow();

	// Set up event listeners
	setupGameListeners();
	setupHotkeyListeners();

	// Check if game is already running
	checkRunningGame();

	state.isInitialized = true;
	logger.info("Background window initialized successfully");
}

/**
 * Obtain reference to the in-game window
 */
function obtainInGameWindow(): void {
	overwolf.windows.obtainDeclaredWindow(WINDOW_NAMES.IN_GAME, (result) => {
		if (result.success) {
			state.inGameWindowId = result.window.id;
			logger.info(`In-game window obtained: ${result.window.id}`);
		} else {
			logger.error("Failed to obtain in-game window", result.error);
		}
	});
}

/**
 * Launch the in-game window
 */
function launchInGameWindow(): void {
	if (!state.inGameWindowId) {
		logger.warn("In-game window ID not available, attempting to obtain...");
		obtainInGameWindow();
		return;
	}

	if (state.isManuallyHidden) {
		logger.debug("In-game window is manually hidden, skipping auto-launch");
		return;
	}

	logger.info("Launching in-game window...");

	overwolf.windows.restore(state.inGameWindowId, (result) => {
		if (result?.success === false) {
			logger.error("Failed to restore in-game window", result);
		} else {
			logger.info("In-game window launched successfully");
		}
	});
}

/**
 * Hide the in-game window
 */
function hideInGameWindow(): void {
	if (!state.inGameWindowId) {
		logger.warn("In-game window ID not available");
		return;
	}

	logger.info("Hiding in-game window...");

	overwolf.windows.hide(state.inGameWindowId, (result) => {
		if (result?.success === false) {
			logger.error("Failed to hide in-game window", result);
		} else {
			logger.info("In-game window hidden successfully");
		}
	});
}

/**
 * Toggle the in-game window visibility
 */
function toggleInGameWindow(): void {
	if (!state.inGameWindowId) {
		logger.warn("In-game window ID not available");
		return;
	}

	overwolf.windows.getWindowState(state.inGameWindowId, (stateResult) => {
		if (!stateResult.success) {
			logger.error("Failed to get window state", stateResult.error);
			return;
		}

		const isVisible = stateResult.window_state === "normal" || stateResult.window_state === "maximized";

		logger.debug(`Toggling in-game window (currently ${stateResult.window_state})`);

		if (isVisible) {
			state.isManuallyHidden = true;
			hideInGameWindow();
		} else {
			state.isManuallyHidden = false;
			launchInGameWindow();
		}
	});
}

/**
 * Handle game launch event
 */
function handleGameLaunched(gameInfo: overwolf.games.RunningGameInfo | null): void {
	if (!gameInfo) {
		logger.debug("Game info is null");
		return;
	}

	if (!isLeagueOfLegends(gameInfo.classId)) {
		logger.debug(`Game launched but not LoL: ${gameInfo.classId}`);
		return;
	}

	logger.info(`League of Legends launched (ID: ${gameInfo.classId})`);

	// Reset manual hide state on new game launch
	state.isManuallyHidden = false;

	// Launch in-game window
	launchInGameWindow();
}

/**
 * Handle game closed event
 */
function handleGameClosed(): void {
	logger.info("League of Legends closed");

	// Reset state
	state.isManuallyHidden = false;

	// Hide in-game window
	if (state.inGameWindowId) {
		hideInGameWindow();
	}
}

/**
 * Set up game event listeners
 */
function setupGameListeners(): void {
	logger.debug("Setting up game event listeners...");

	overwolf.games.onGameInfoUpdated.addListener((event) => {
		if (!event.gameInfo) {
			logger.debug("Game info updated: no game info");
			return;
		}

		logger.debug("Game info updated", {
			id: event.gameInfo.id,
			isRunning: event.gameInfo.isRunning,
			runningChanged: event.runningChanged,
		});

		// Handle running state changes
		if (event.runningChanged) {
			overwolf.games.getRunningGameInfo((result) => {
				if (result && result.isRunning) {
					handleGameLaunched(result);
				} else {
					handleGameClosed();
				}
			});
		}
	});

	logger.info("Game event listeners registered");
}

/**
 * Set up hotkey event listeners
 */
function setupHotkeyListeners(): void {
	logger.debug("Setting up hotkey listeners...");

	overwolf.settings.hotkeys.onPressed.addListener((event) => {
		logger.debug(`Hotkey pressed: ${event.name}`);

		if (event.name === HOTKEY_NAMES.SHOW_HIDE_IN_GAME) {
			toggleInGameWindow();
		}
	});

	logger.info("Hotkey listeners registered");
}

/**
 * Check if a game is already running on startup
 */
function checkRunningGame(): void {
	logger.debug("Checking for running game...");

	overwolf.games.getRunningGameInfo((result) => {
		if (!result) {
			logger.debug("No running game found");
			return;
		}

		if (result.isRunning && isLeagueOfLegends(result.classId)) {
			logger.info(`League of Legends already running (ID: ${result.classId})`);
			handleGameLaunched(result);
		} else {
			logger.debug("No League of Legends game running");
		}
	});
}

/**
 * Application entry point
 */
function main(): void {
	logger.info("=== AbTracker Background Window Starting ===");
	logger.info(`Environment: ${import.meta.env.DEV ? "Development" : "Production"}`);

	// Initialize the application
	initialize();

	// Set up window close handler
	overwolf.windows.getCurrentWindow((result) => {
		if (result.success) {
			logger.info(`Background window ID: ${result.window.id}`);
		}
	});

	logger.info("=== AbTracker Background Window Ready ===");
}

// Start the application
if (typeof overwolf !== "undefined") {
	main();
} else {
	console.error("Overwolf API not available!");
}

// Export for testing/debugging
if (import.meta.env.DEV) {
	interface WindowWithDebug extends Window {
		__backgroundState?: AppState;
		__backgroundDebug?: {
			launchInGameWindow: () => void;
			hideInGameWindow: () => void;
			toggleInGameWindow: () => void;
			checkRunningGame: () => void;
		};
	}

	const win = window as WindowWithDebug;
	win.__backgroundState = state;
	win.__backgroundDebug = {
		launchInGameWindow,
		hideInGameWindow,
		toggleInGameWindow,
		checkRunningGame,
	};
}
