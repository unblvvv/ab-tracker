/**
 * Logger utility for debugging and error tracking
 */

export enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

interface LogEntry {
	level: LogLevel
	timestamp: string
	message: string
	data?: unknown
}

class Logger {
	private static instance: Logger
	private logs: LogEntry[] = []
	private maxLogs = 1000
	private isDevelopment = import.meta.env.DEV

	private constructor() {}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger()
		}
		return Logger.instance
	}

	private log(level: LogLevel, message: string, data?: unknown): void {
		const entry: LogEntry = {
			level,
			timestamp: new Date().toISOString(),
			message,
			data,
		}

		// Add to logs array
		this.logs.push(entry)

		// Keep only last N logs
		if (this.logs.length > this.maxLogs) {
			this.logs.shift()
		}

		// Console output in development or for errors
		if (this.isDevelopment || level === LogLevel.ERROR) {
			this.consoleLog(entry)
		}
	}

	private consoleLog(entry: LogEntry): void {
		const prefix = `[${entry.timestamp}] [${entry.level}]`
		const message = `${prefix} ${entry.message}`

		switch (entry.level) {
			case LogLevel.DEBUG:
				console.debug(message, entry.data ?? '')
				break
			case LogLevel.INFO:
				console.info(message, entry.data ?? '')
				break
			case LogLevel.WARN:
				console.warn(message, entry.data ?? '')
				break
			case LogLevel.ERROR:
				console.error(message, entry.data ?? '')
				break
		}
	}

	debug(message: string, data?: unknown): void {
		this.log(LogLevel.DEBUG, message, data)
	}

	info(message: string, data?: unknown): void {
		this.log(LogLevel.INFO, message, data)
	}

	warn(message: string, data?: unknown): void {
		this.log(LogLevel.WARN, message, data)
	}

	error(message: string, data?: unknown): void {
		this.log(LogLevel.ERROR, message, data)
	}

	getLogs(): LogEntry[] {
		return [...this.logs]
	}

	clearLogs(): void {
		this.logs = []
	}

	exportLogs(): string {
		return JSON.stringify(this.logs, null, 2)
	}
}

// Export singleton instance
export const logger = Logger.getInstance()

// Convenience exports
export const debug = (message: string, data?: unknown) =>
	logger.debug(message, data)
export const info = (message: string, data?: unknown) =>
	logger.info(message, data)
export const warn = (message: string, data?: unknown) =>
	logger.warn(message, data)
export const error = (message: string, data?: unknown) =>
	logger.error(message, data)
