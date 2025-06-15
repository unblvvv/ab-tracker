import { configureStore, createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
	name: 'game',
	initialState: {
		kda: { kills: 0, deaths: 0, assists: 0 },
		creepStats: { lastHits: 0, denies: 0 },
	},
	reducers: {
		updateKDA: (state, action) => {
			state.kda = action.payload
		},
		updateCreepStats: (state, action) => {
			state.creepStats = action.payload
		},
	},
})

export const { updateKDA, updateCreepStats } = gameSlice.actions
export const store = configureStore({ reducer: { game: gameSlice.reducer } })
export type RootState = ReturnType<typeof store.getState>
