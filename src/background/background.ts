import { OWGameListener, OWGames, OWWindow } from "@overwolf/overwolf-api-ts"
import { kGameClassIds, kWindowNames } from '../const'

import RunningGameInfo = overwolf.games.RunningGameInfo;
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent;

class BackgroundController {
	private static _instance: BackgroundController;
	private _windows: Record<string, OWWindow> = {};
	private _gameListener: OWGameListener | undefined;

	private constructor() {
		this._windows[kWindowNames.inGame] = new OWWindow(kWindowNames.inGame);
		this._windows[kWindowNames.desktop] = new OWWindow(kWindowNames.desktop);

		this._gameListener = new OWGameListener({
			onGameStarted: this.toggleWindows.bind(this),
			onGameEnded: this.toggleWindows.bind(this)
		});

		overwolf.extensions.onAppLaunchTriggered.addListener(
			e => this.onAppLaunchTriggered(e)
		)
	}

	public static instance(): BackgroundController {
		if (!BackgroundController._instance) {
			BackgroundController._instance = new BackgroundController();
		}
		return BackgroundController._instance;
	}

	public async run() {
		this._gameListener?.start();

		const currentWindowName = (await this.isSupportedGameRunning())
			? kWindowNames.inGame
			: kWindowNames.desktop;
		this._windows[currentWindowName].restore();
	}

	private async onAppLaunchTriggered(e: AppLaunchTriggeredEvent) {
		if (!e || e.origin.includes('gamelaunchevent')) {
			return;
		}
		if (await this.isSupportedGameRunning()) {
			this._windows[kWindowNames.inGame].restore();
			this._windows[kWindowNames.desktop].close();
		} else {
			this._windows[kWindowNames.inGame].close();
			this._windows[kWindowNames.desktop].restore();
		}
	}

	private toggleWindows(info: RunningGameInfo) {
		if(!info || !this.isSupportedGame(info)){
			return;
		}
		if(info.isRunning){
			this._windows[kWindowNames.inGame].restore();
			this._windows[kWindowNames.desktop].close();
		} else {
			this._windows[kWindowNames.inGame].close();
			this._windows[kWindowNames.desktop].restore();
		}
	}

	private async isSupportedGameRunning(): Promise<boolean> {
		const info = await OWGames.getRunningGameInfo();
		return info && info.isRunning && this.isSupportedGame(info);
	}

	private isSupportedGame(info: RunningGameInfo) {
		return kGameClassIds.includes(info.classId);
	}
}

BackgroundController.instance().run();