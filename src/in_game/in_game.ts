import {
	OWGames,
	OWGamesEvents,
	OWHotkeys,
} from "@overwolf/overwolf-api-ts"

import { AppWindow } from "../AppWindow"
import { kGamesFeatures, kHotkeys, kWindowNames } from "../const"

import WindowState = overwolf.windows.enums.WindowStateEx;

class InGame extends AppWindow {
	private static _instance: InGame;
	private _gameEventsListener: OWGamesEvents | undefined;
	private _eventsLog: HTMLElement;
	private _infoLog: HTMLElement;

	private constructor() {
		super(kWindowNames.inGame);

		this._eventsLog = document.getElementById('eventsLog') as HTMLElement;
		this._infoLog = document.getElementById('infoLog') as HTMLElement;

		if (!this._eventsLog || !this._infoLog) {
			throw new Error("Required DOM elements 'eventsLog' or 'infoLog' are missing.");
		}

		this.setToggleHotkeyBehavior();
		this.setToggleHotkeyText();
	}

	public static instance() {
		if (!this._instance) {
			this._instance = new InGame();
		}

		return this._instance;
	}

	public async run() {
		const gameClassId = await this.getCurrentGameClassId();

		const gameFeatures = gameClassId !== null ? kGamesFeatures.get(gameClassId) : undefined;

		if (gameFeatures && gameFeatures.length) {
		this._gameEventsListener = new OWGamesEvents(
			{
			onInfoUpdates: this.onInfoUpdates.bind(this),
			onNewEvents: this.onNewEvents.bind(this)
			},
			gameFeatures
		);

		this._gameEventsListener.start();
		}
	}

	private onInfoUpdates(info: any) {
		this.logLine(this._infoLog, info, false);
	}

	private onNewEvents(e: { events: { name: any }[] }) {
		const shouldHighlight = e.events.some((event: { name: any }) => {
			switch (event.name) {
				case 'kill':
				case 'death':
				case 'assist':
				case 'level':
				case 'matchStart':
				case 'match_start':
				case 'matchEnd':
				case 'match_end':
				return true;
			}

		return false
		});
		this.logLine(this._eventsLog, e, shouldHighlight);
	}

	private async setToggleHotkeyText() {
		const gameClassId = await this.getCurrentGameClassId();
		const hotkeyText = await OWHotkeys.getHotkeyText(kHotkeys.toggle, gameClassId ?? undefined);
		const hotkeyElem = document.getElementById('hotkey');
		if (hotkeyElem) {
			hotkeyElem.textContent = hotkeyText;
		}
	}

	private async setToggleHotkeyBehavior() {
		const toggleInGameWindow = async (
		hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
		): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`);
			const inGameState = await this.getWindowState();

			if (inGameState.window_state === WindowState.normal ||
				inGameState.window_state === WindowState.maximized) {
				this._currentWindow.minimize();
			} else if (inGameState.window_state === WindowState.minimized ||
				inGameState.window_state === WindowState.closed) {
				this._currentWindow.restore();
			}
		}

		OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
	}

	private logLine(log: HTMLElement, data: { events: { name: any }[] }, highlight: boolean) {
		const line = document.createElement('pre');
		line.textContent = JSON.stringify(data);

		if (highlight) {
			line.className = 'highlight';
		}

		const shouldAutoScroll =
		log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;

		log.appendChild(line);

		if (shouldAutoScroll) {
			log.scrollTop = log.scrollHeight;
		}
	}

	private async getCurrentGameClassId(): Promise<number | null> {
		const info = await OWGames.getRunningGameInfo();

		return (info && info.isRunning && info.classId) ? info.classId : null;
	}
}

InGame.instance().run();
