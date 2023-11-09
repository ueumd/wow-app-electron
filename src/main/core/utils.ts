import { screen } from 'electron'
import { exec as execs } from 'child_process'
export const isDev = process.env.NODE_ENV === 'development'

export function getScreenSize() {
	const { size, scaleFactor } = screen.getPrimaryDisplay()
	return {
		width: size.width * scaleFactor,
		height: size.height * scaleFactor
	}
}

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function uuidv4(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

export interface Platform {
	isWindows: boolean
	isMacOS: boolean
	isLinux: boolean
}

export const platform: Platform = {
	isWindows: process.platform === 'win32',
	isMacOS: process.platform === 'darwin',
	isLinux: process.platform === 'linux'
}

/**
 *  根据进程名查找进程ID
 * @param pidName	进程名称
 * @param callback
 */
export function findProcessIdByName(pidName: string, callback) {
	const cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
	execs(cmd, function (err, stdout, _) {
		if (err) {
			return console.error(err)
		}
		stdout.split('\n').filter(line => {
			const processMessage = line.trim().split(/\s+/)
			const processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
			if (processName === pidName) {
				return callback(processMessage[1])
			}
		})
	})
}
