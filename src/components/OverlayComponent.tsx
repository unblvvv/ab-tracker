import React, { useEffect } from 'react'

import '../../public/general.css'
import '../../public/header.css'
import '../../public/ingame.css'

const OverlayComponent: React.FC = () => {
	useEffect(() => {
		const closeButton = document.getElementById('closeButton')
		const header = document.getElementById('header')
		const hotkeyElement = document.getElementById('hotkey')

		if (header) {
			header.addEventListener('mousedown', () => {
				overwolf.windows.getCurrentWindow(result => {
					if (result.success) {
						overwolf.windows.dragMove(result.window.id)
					}
				})
			})
		}

		overwolf.settings.hotkeys.get(result => {
			if (result.success && result.games) {
				const hotkey = result.games['5426']?.find(
					hk => hk.name === 'show_hide_in_game'
				)
				if (hotkey && hotkey.binding && hotkeyElement) {
					hotkeyElement.textContent = hotkey.binding
				}
			}
		})

		const closeHandler = () => overwolf.windows.close('in_game')
		closeButton?.addEventListener('click', closeHandler)

		return () => {
			closeButton?.removeEventListener('click', closeHandler)
			if (header) {
				header.removeEventListener('mousedown', () => {
					overwolf.windows.getCurrentWindow(result => {
						if (result.success) {
							overwolf.windows.dragMove(result.window.id)
						}
					})
				})
			}
		}
	}, [])

	return (
		<div className=''>
			<header id='header' className='app-header'>
				<h1>AbTracker</h1>
				<h1 className='hotkey-text'>
					Show/Hide Hotkey:
					<kbd id='hotkey'></kbd>
				</h1>
				<div className='window-controls-group'>
					<button
						id='closeButton'
						className='window-control window-control-close'
					/>
				</div>
			</header>

			<main>
				<div id='logs'>
					<div id='events' className='logColumn'>
						<h1>Game Events</h1>
						<div id='eventsLog' className='dataText'></div>
					</div>
					<div id='infoUpdates' className='logColumn'>
						<h1>Info Updates</h1>
						<div id='infoLog' className='dataText'></div>
					</div>
				</div>
				<div id='other'>
					<h1>Real-time Game Data</h1>
					<p id='infoParagraph'>
						The background controller of this app is listening to all the game
						events and info updates, and sends them to this window, that prints
						them to the screen. Some specific events (Match Start/End, Kill and
						Death) are painted in tea and logged to the developers console.
					</p>
				</div>
			</main>
		</div>
	)
}

export default OverlayComponent
