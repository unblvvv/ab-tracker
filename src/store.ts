/**
 * Redux store configuration
 * Manages application state for game data, UI, and settings
 */

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Participant } from "./types/game.types";

/**
 * Game state interface
 */
interface GameState {
	participants: Participant[];
	isGameLive: boolean;
	isLoading: boolean;
	error: string | null;
	lastUpdate: number | null;
}

/**
 * UI state interface
 */
interface UIState {
	isOverlayVisible: boolean;
	isDragging: boolean;
	showAbilities: boolean;
	showStats: boolean;
	showDebug: boolean;
}

/**
 * Settings state interface
 */
interface SettingsState {
	pollingInterval: number;
	autoHideDelay: number;
	opacity: number;
	scale: number;
	enableAnimations: boolean;
	enableSounds: boolean;
}

/**
 * Initial game state
 */
const initialGameState: GameState = {
	participants: [],
	isGameLive: false,
	isLoading: false,
	error: null,
	lastUpdate: null,
};

/**
 * Initial UI state
 */
const initialUIState: UIState = {
	isOverlayVisible: true,
	isDragging: false,
	showAbilities: true,
	showStats: true,
	showDebug: false,
};

/**
 * Initial settings state
 */
const initialSettingsState: SettingsState = {
	pollingInterval: 5000,
	autoHideDelay: 0,
	opacity: 1,
	scale: 1,
	enableAnimations: true,
	enableSounds: false,
};

/**
 * Game slice - manages game-related state
 */
const gameSlice = createSlice({
	name: "game",
	initialState: initialGameState,
	reducers: {
		setParticipants: (state, action: PayloadAction<Participant[]>) => {
			state.participants = action.payload;
			state.lastUpdate = Date.now();
		},
		addParticipant: (state, action: PayloadAction<Participant>) => {
			const exists = state.participants.some((p) => p.summonerName === action.payload.summonerName);
			if (!exists) {
				state.participants.push(action.payload);
			}
		},
		updateParticipant: (state, action: PayloadAction<{ summonerName: string; data: Partial<Participant> }>) => {
			const index = state.participants.findIndex((p) => p.summonerName === action.payload.summonerName);
			if (index !== -1) {
				state.participants[index] = {
					...state.participants[index],
					...action.payload.data,
				};
			}
		},
		removeParticipant: (state, action: PayloadAction<string>) => {
			state.participants = state.participants.filter((p) => p.summonerName !== action.payload);
		},
		clearParticipants: (state) => {
			state.participants = [];
			state.lastUpdate = null;
		},
		setGameLive: (state, action: PayloadAction<boolean>) => {
			state.isGameLive = action.payload;
			if (!action.payload) {
				// Clear participants when game ends
				state.participants = [];
			}
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		resetGameState: () => initialGameState,
	},
});

/**
 * UI slice - manages UI state
 */
const uiSlice = createSlice({
	name: "ui",
	initialState: initialUIState,
	reducers: {
		setOverlayVisible: (state, action: PayloadAction<boolean>) => {
			state.isOverlayVisible = action.payload;
		},
		toggleOverlay: (state) => {
			state.isOverlayVisible = !state.isOverlayVisible;
		},
		setDragging: (state, action: PayloadAction<boolean>) => {
			state.isDragging = action.payload;
		},
		setShowAbilities: (state, action: PayloadAction<boolean>) => {
			state.showAbilities = action.payload;
		},
		toggleAbilities: (state) => {
			state.showAbilities = !state.showAbilities;
		},
		setShowStats: (state, action: PayloadAction<boolean>) => {
			state.showStats = action.payload;
		},
		toggleStats: (state) => {
			state.showStats = !state.showStats;
		},
		setShowDebug: (state, action: PayloadAction<boolean>) => {
			state.showDebug = action.payload;
		},
		toggleDebug: (state) => {
			state.showDebug = !state.showDebug;
		},
		resetUIState: () => initialUIState,
	},
});

/**
 * Settings slice - manages user settings
 */
const settingsSlice = createSlice({
	name: "settings",
	initialState: initialSettingsState,
	reducers: {
		setPollingInterval: (state, action: PayloadAction<number>) => {
			state.pollingInterval = Math.max(1000, action.payload);
		},
		setAutoHideDelay: (state, action: PayloadAction<number>) => {
			state.autoHideDelay = Math.max(0, action.payload);
		},
		setOpacity: (state, action: PayloadAction<number>) => {
			state.opacity = Math.max(0, Math.min(1, action.payload));
		},
		setScale: (state, action: PayloadAction<number>) => {
			state.scale = Math.max(0.5, Math.min(2, action.payload));
		},
		setEnableAnimations: (state, action: PayloadAction<boolean>) => {
			state.enableAnimations = action.payload;
		},
		setEnableSounds: (state, action: PayloadAction<boolean>) => {
			state.enableSounds = action.payload;
		},
		resetSettings: () => initialSettingsState,
	},
});

/**
 * Configure and create the Redux store
 */
export const store = configureStore({
	reducer: {
		game: gameSlice.reducer,
		ui: uiSlice.reducer,
		settings: settingsSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these paths in the serializable check
				ignoredActions: ["game/setParticipants", "game/addParticipant"],
				ignoredPaths: ["game.lastUpdate"],
			},
		}),
	devTools: import.meta.env.DEV,
});

/**
 * Export types
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Export actions
 */
export const gameActions = gameSlice.actions;
export const uiActions = uiSlice.actions;
export const settingsActions = settingsSlice.actions;

/**
 * Selectors
 */
export const selectGame = (state: RootState) => state.game;
export const selectUI = (state: RootState) => state.ui;
export const selectSettings = (state: RootState) => state.settings;

export const selectParticipants = (state: RootState) => state.game.participants;
export const selectIsGameLive = (state: RootState) => state.game.isGameLive;
export const selectIsLoading = (state: RootState) => state.game.isLoading;
export const selectError = (state: RootState) => state.game.error;

export const selectTeam100 = (state: RootState) => state.game.participants.filter((p) => p.teamId === 100);
export const selectTeam200 = (state: RootState) => state.game.participants.filter((p) => p.teamId === 200);

export const selectIsOverlayVisible = (state: RootState) => state.ui.isOverlayVisible;
export const selectShowAbilities = (state: RootState) => state.ui.showAbilities;
export const selectShowStats = (state: RootState) => state.ui.showStats;
export const selectShowDebug = (state: RootState) => state.ui.showDebug;
