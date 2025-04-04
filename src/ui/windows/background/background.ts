// /// <reference types="@overwolf/types" />

// function isLoL(gameId: number): boolean {
// 	return Math.floor(gameId / 10) === 5426
// }

// function launchInGameWindow() {
// 	overwolf.windows.obtainDeclaredWindow('in_game', result => {
// 		if (result.success) {
// 			overwolf.windows.restore(result.window.id)
// 		}
// 	})
// }

// function hideInGameWindow() {
// 	overwolf.windows.obtainDeclaredWindow('in_game', result => {
// 		if (result.success) {
// 			overwolf.windows.hide(result.window.id)
// 		}
// 	})
// }

// function toggleInGameWindow() {
// 	overwolf.windows.obtainDeclaredWindow('in_game', result => {
// 		if (result.success) {
// 			overwolf.windows.getWindowState(result.window.id, stateResult => {
// 				if (stateResult.success) {
// 					if (
// 						stateResult.window_state === 'normal' ||
// 						stateResult.window_state === 'minimized'
// 					) {
// 						overwolf.windows.hide(result.window.id)
// 					} else {
// 						overwolf.windows.restore(result.window.id)
// 					}
// 				}
// 			})
// 		}
// 	})

// 	overwolf.games.onGameInfoUpdated.addListener(res => {
// 		if (res.gameInfo?.isRunning && isLoL(res.gameInfo.id)) {
// 			launchInGameWindow()
// 		}
// 	})

// 	overwolf.games.getRunningGameInfo(res => {
// 		if (res?.isRunning && isLoL(res.id)) {
// 			launchInGameWindow()
// 		}
// 	})

// 	overwolf.games.events.setRequiredFeatures(
// 		['match_state_changed', 'match_ended'],
// 		response => {
// 			if (!response.success) {
// 				console.error(response.error)
// 			} else {
// 				console.log('GEP connected:', response)
// 			}
// 		}
// 	)

// 	// overwolf.games.events.onNewEvents.addListener(event => {
// 	// 	event.events.forEach(e => {
// 	// 		if (e.name === 'match_state_changed') {
// 	// 			const matchState = JSON.parse(e.data)?.match_state

// 	// 			if (matchState === 'DOTA_GAMERULES_STATE_STRATEGY_TIME') {
// 	// 				launchInGameWindow()
// 	// 			}
// 	// 		}

// 	// 		if (e.name === 'match_ended') {
// 	// 			hideInGameWindow()
// 	// 		}
// 	// 	})
// 	// })

// 	overwolf.settings.hotkeys.onPressed.addListener(event => {
// 		if (event.name === 'show_hide_in_game') {
// 			toggleInGameWindow()
// 		}
// 	})
// }
/// <reference types="@overwolf/types" />

console.log('Background running!')

function isDota2(gameId: number): boolean {
	return Math.floor(gameId / 10) === 5426
}

function launchInGameWindow() {
	overwolf.windows.obtainDeclaredWindow('in_game', result => {
		if (result.success) {
			overwolf.windows.restore(result.window.id)
		}
	})
}

function hideInGameWindow() {
	overwolf.windows.obtainDeclaredWindow('in_game', result => {
		if (result.success) {
			overwolf.windows.hide(result.window.id)
		}
	})
}

function toggleInGameWindow() {
	overwolf.windows.obtainDeclaredWindow('in_game', result => {
		if (result.success) {
			overwolf.windows.getWindowState(result.window.id, stateResult => {
				if (stateResult.success) {
					const isVisible =
						stateResult.window_state === 'normal' ||
						stateResult.window_state === 'maximized'

					if (isVisible) {
						overwolf.windows.hide(result.window.id)
					} else {
						overwolf.windows.restore(result.window.id)
					}
				} else {
					console.error(stateResult.error)
				}
			})
		} else {
			console.error(result.error)
		}
	})
}

overwolf.games.onGameInfoUpdated.addListener(res => {
	if (res.gameInfo?.isRunning && isDota2(res.gameInfo.id)) {
		launchInGameWindow()
	}
})

overwolf.games.getRunningGameInfo(res => {
	if (res?.isRunning && isDota2(res.id)) {
		launchInGameWindow()
	}
})

overwolf.games.events.setRequiredFeatures(
	['match_state_changed', 'match_ended'],
	response => {
		if (!response.success) {
			console.error(response.error)
		} else {
			console.log('GEP connected:', response)
		}
	}
)

overwolf.games.events.onNewEvents.addListener(event => {
	event.events.forEach(e => {
		if (e.name === 'match_state_changed') {
			const matchState = JSON.parse(e.data)?.match_state

			if (matchState === 'DOTA_GAMERULES_STATE_STRATEGY_TIME') {
				launchInGameWindow()
			}
		}

		if (e.name === 'match_ended') {
			hideInGameWindow()
		}
	})
})

overwolf.settings.hotkeys.onPressed.addListener(event => {
	if (event.name === 'show_hide_in_game') {
		toggleInGameWindow()
	}
})
