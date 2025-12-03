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
			className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-bg-secondary/95 to-bg-elevated/95 border-b border-white/10 backdrop-blur-glass cursor-move select-none z-[1000] animate-slide-down"
		>
			<h1 className="text-lg font-bold tracking-wide gradient-text m-0">AbTracker</h1>

			{showHotkey && (
				<div className="flex items-center gap-2 flex-1 justify-center">
					<span className="text-[13px] text-text-tertiary font-medium">Show/Hide Hotkey:</span>
					<kbd className="inline-block px-3 py-1 bg-primary/20 border border-primary/40 rounded text-secondary font-mono text-xs font-semibold min-w-[60px] text-center shadow-glow">
						{binding || "Not Set"}
					</kbd>
				</div>
			)}

			<div className="flex gap-2">
				{onMinimize && (
					<button
						onClick={onMinimize}
						className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-md cursor-pointer transition-all duration-base hover:bg-white/10 hover:border-white/20 hover:-translate-y-px active:translate-y-0 hover:bg-secondary/20 hover:border-secondary/40 focus-visible"
						aria-label="Minimize"
						title="Minimize"
					>
						<span className="text-xl font-normal text-white leading-none">−</span>
					</button>
				)}

				{onClose && (
					<button
						onClick={onClose}
						className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-md cursor-pointer transition-all duration-base hover:bg-white/10 hover:border-white/20 hover:-translate-y-px active:translate-y-0 hover:bg-error/20 hover:border-error/40 focus-visible"
						aria-label="Close"
						title="Close"
					>
						<span className="text-xl font-normal text-white leading-none">×</span>
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
