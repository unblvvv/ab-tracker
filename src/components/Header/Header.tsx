/**
 * Header component for the in-game overlay
 * Displays app title, hotkey binding, and window controls
 */

import React from "react";
import { useOverwolfHotkey } from "../../hooks/useOverwolfHotkey";
import { HOTKEY_NAMES } from "../../constants/game.constants";

interface HeaderProps {
	onClose?: () => void;
	onMinimize?: () => void;
	dragElementId?: string;
	showHotkey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onClose, onMinimize, dragElementId = "header", showHotkey = true }) => {
	const { binding } = useOverwolfHotkey({
		hotkeyName: HOTKEY_NAMES.SHOW_HIDE_IN_GAME,
	});

	return (
		<header
			id={dragElementId}
			className="flex items-center justify-between px-6 py-3 backdrop-blur-strong bg-bg-body/60 border-b border-border cursor-move select-none z-[100] animate-slide-down"
		>
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-bold m-0 text-text-primary tracking-tight">AbTracker</h1>
			</div>

			{showHotkey && (
				<div className="flex items-center gap-2">
					<span className="text-xs text-text-tertiary font-medium uppercase tracking-wide">Hotkey</span>
					<kbd className="px-3 py-1 bg-bg-surface border border-primary/30 rounded-md font-mono text-xs font-semibold text-primary min-w-[60px] text-center">
						{binding || "Not Set"}
					</kbd>
				</div>
			)}

			<div className="flex gap-2">
				{onMinimize && (
					<button
						onClick={onMinimize}
						className="w-7 h-7 flex items-center justify-center bg-bg-surface border border-border rounded-md transition-all duration-base hover:bg-bg-surface-hover hover:border-border-light active:scale-95"
						aria-label="Minimize"
						title="Minimize"
					>
						<span className="text-text-secondary text-lg font-light leading-none">−</span>
					</button>
				)}

				{onClose && (
					<button
						onClick={onClose}
						className="w-7 h-7 flex items-center justify-center bg-bg-surface border border-border rounded-md transition-all duration-base hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 active:scale-95"
						aria-label="Close"
						title="Close"
					>
						<span className="text-text-secondary text-lg font-light leading-none">×</span>
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
