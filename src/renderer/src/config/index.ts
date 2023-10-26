import pkg from '../../../../package.json'

const createAppDataDirectory = dirName => {
	dirName = window.process?.platform === 'win32' ? `\\${dirName}\\` : `/${dirName}/`
	return window.process?.env?.APPDATA + dirName
}

export const config = {
	isDev: import.meta.env.DEV,
	isWindows: window.process?.platform === 'win32',
	isMacOS: window.process?.platform === 'darwin',
	isLinux: window.process?.platform === 'linux',
	appDataPath: createAppDataDirectory(pkg.name)
}
