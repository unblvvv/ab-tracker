/**
 * Custom hook for managing Overwolf window operations
 * Provides utilities for window manipulation, drag, minimize, close, etc.
 */

import { useEffect, useCallback, useState } from "react";
import { logger } from "../utils/logger.utils";
import type { OverwolfWindowResult } from "../types/overwolf.types";

export interface UseOverwolfWindowOptions {
	windowName: string;
	enableDrag?: boolean;
	dragElementId?: string;
}

export interface UseOverwolfWindowReturn {
	windowId: string | null;
	isVisible: boolean;
	isMinimized: boolean;
	minimize: () => void;
	restore: () => void;
	close: () => void;
	hide: () => void;
	toggle: () => void;
	dragMove: () => void;
}

/**
 * Hook for managing Overwolf window operations
 * @param options - Window configuration options
 * @returns Window control functions and state
 */
export function useOverwolfWindow(options: UseOverwolfWindowOptions): UseOverwolfWindowReturn {
	const { windowName, enableDrag = false, dragElementId } = options;

	const [windowId, setWindowId] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);

	// Get window ID on mount
	useEffect(() => {
		if (!window.overwolf) {
			logger.warn("Overwolf API not available");
			return;
		}

		overwolf.windows.obtainDeclaredWindow(windowName, (result: OverwolfWindowResult) => {
			if (result.success) {
				setWindowId(result.window.id);
				logger.debug(`Window obtained: ${windowName}`, {
					id: result.window.id,
				});
			} else {
				logger.error(`Failed to obtain window: ${windowName}`, result.error);
			}
		});
	}, [windowName]);

	// Update window state
	const updateWindowState = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		overwolf.windows.getWindowState(windowId, (result) => {
			if (result.success && result.window_state) {
				setIsVisible(result.window_state === "normal" || result.window_state === "maximized");
				setIsMinimized(result.window_state === "minimized");
			}
		});
	}, [windowId]);

	// Update state periodically
	useEffect(() => {
		if (!windowId) return;

		updateWindowState();
		const interval = setInterval(updateWindowState, 1000);

		return () => clearInterval(interval);
	}, [windowId, updateWindowState]);

	// Enable drag functionality
	useEffect(() => {
		if (!enableDrag || !dragElementId || !windowId) return;

		const dragElement = document.getElementById(dragElementId);
		if (!dragElement) {
			logger.warn(`Drag element not found: ${dragElementId}`);
			return;
		}

		const handleMouseDown = () => {
			if (window.overwolf) {
				overwolf.windows.dragMove(windowId);
			}
		};

		dragElement.addEventListener("mousedown", handleMouseDown);

		return () => {
			dragElement.removeEventListener("mousedown", handleMouseDown);
		};
	}, [enableDrag, dragElementId, windowId]);

	// Window control functions
	const minimize = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		logger.debug(`Minimizing window: ${windowName}`);
		overwolf.windows.minimize(windowId, () => {
			updateWindowState();
		});
	}, [windowId, windowName, updateWindowState]);

	const restore = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		logger.debug(`Restoring window: ${windowName}`);
		overwolf.windows.restore(windowId, () => {
			updateWindowState();
		});
	}, [windowId, windowName, updateWindowState]);

	const close = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		logger.debug(`Closing window: ${windowName}`);
		overwolf.windows.close(windowId);
	}, [windowId, windowName]);

	const hide = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		logger.debug(`Hiding window: ${windowName}`);
		overwolf.windows.hide(windowId, () => {
			updateWindowState();
		});
	}, [windowId, windowName, updateWindowState]);

	const toggle = useCallback(() => {
		if (isVisible) {
			hide();
		} else {
			restore();
		}
	}, [isVisible, hide, restore]);

	const dragMove = useCallback(() => {
		if (!windowId || !window.overwolf) return;

		overwolf.windows.dragMove(windowId);
	}, [windowId]);

	return {
		windowId,
		isVisible,
		isMinimized,
		minimize,
		restore,
		close,
		hide,
		toggle,
		dragMove,
	};
}
