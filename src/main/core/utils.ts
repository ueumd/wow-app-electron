import { screen } from 'electron'
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
