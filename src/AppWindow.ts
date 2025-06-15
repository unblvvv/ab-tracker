import { OWWindow } from "@overwolf/overwolf-api-ts"

export class AppWindow {
	protected _currentWindow: OWWindow;
	protected _mainWindow: OWWindow;
	protected _maximized: boolean = false;

	constructor(windowName: string) {
		this._currentWindow = new OWWindow(windowName);
		this._mainWindow = new OWWindow("background");

		const closeButton = document.getElementById("closeButton") as HTMLButtonElement;
		const minimizeButton = document.getElementById("minimizeButton") as HTMLButtonElement;
		const maximizeButton = document.getElementById("maximizeButton") as HTMLButtonElement;

		const header = document.getElementById("header") as HTMLElement;

		this.setDrag(header);

		closeButton.addEventListener("click", () => {
			this._currentWindow.close();
		});

		minimizeButton.addEventListener("click", () => {
			this._currentWindow.minimize();
		});

		maximizeButton.addEventListener('click', () => {
			if (!this._maximized) {
			  this._currentWindow.maximize();
			} else {
			  this._currentWindow.restore();
			}
	  
			this._maximized = !this._maximized;
		});
	}

	public async getWindowState() {
		return await this._currentWindow.getWindowState();
	}

	private async setDrag(elem: any) {
		this._currentWindow.dragMove(elem);
	}
}