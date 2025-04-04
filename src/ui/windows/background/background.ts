/// <reference types="@overwolf/types" />

function isLoL(gameId: number): boolean {
	return Math.floor(gameId / 10) === 5426
}

function launchInGameWindow() {
	overwolf.windows.obtainDeclaredWindow('in_game', result => {
		if (result.success) {
			overwolf.windows.restore(result.window.id)
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
	if (res.gameInfo?.isRunning && isLoL(res.gameInfo.id)) {
		launchInGameWindow()
	}
})

overwolf.games.getRunningGameInfo(res => {
	if (res?.isRunning && isLoL(res.id)) {
		launchInGameWindow()
	}
})

overwolf.settings.hotkeys.onPressed.addListener(event => {
	if (event.name === 'show_hide_in_game') {
		toggleInGameWindow()
	}
})
