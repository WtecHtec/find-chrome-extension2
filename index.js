const fs = require('fs');
const path = require('path');
const os = require('os');
const homeDirectory = os.homedir();

/**
 * Determines if the specified path is a directory.
 * @param {string} abspath - the absolute path to check
 * @returns {boolean} true if abspath is a directory
 */
function isDirectory(abspath) {
	if (fs.existsSync(abspath)) {
		const stats = fs.statSync(abspath);
		if (stats.isDirectory()) {
			return true;
		}
	}
	return false;
}

/**
 * Determines if the specified path is a file.
 * @param {string} abspath - the absolute path to check
 * @returns {boolean} true if abspath is a file
 */
function isFile(abspath) {
	if (fs.existsSync(abspath)) {
		const stats = fs.statSync(abspath);
		if (stats.isFile()) {
			return true;
		}
	}
	return false;
}

/**
 * Gets all directories in the directory specified by the absolute path.
 * @param {string} abspath - the absolute path of the directory
 * @returns {string[]} an array of directories
 */
function getDirectories(abspath) {
	const directories = [];
	const names = fs.readdirSync(abspath);
	for (const name of names) {
		const directory = path.join(abspath, name);
		if (isDirectory(directory)) {
			directories.push(directory);
		}
	}
	return directories;
}

/**
 * Finds the platform-specific Google Chrome directory.
 * @returns {string} the absolute path of the Chrome directory
 */
function getChromeDirectory() {
	const directories = {
		darwin: ['Library', 'Application Support', 'Google', 'Chrome'],
		win32: ['AppData', 'Local', 'Google', 'Chrome', 'User Data'],
		linux: ['.config', 'google-chrome']
	};
	const home = process.env.HOME || homeDirectory;

	const platform = process.platform;
	const directory = directories[platform];

	if (directory) {
		const abspath = path.join(home, ...directory);
		if (isDirectory(abspath)) {
			return abspath;
		}
	}
	return null;
}

/**
 * Gets the extension directories from all Google Chrome profiles.
 * @returns {string[]} an array of directories
 */
function getExtensionDirectories() {
	const directories = [];
	const chrome = getChromeDirectory();
	if (!chrome) return [];
	const extPathMap = {}
	const names = fs.readdirSync(chrome);
	for (const name of names) {
		const abspath = path.join(chrome, name, 'Extensions');
		if ((name === 'Default' || name.startsWith('Profile ')) && isDirectory(abspath)) {
			const extensions = getDirectories(abspath);
			// console.log(extensions)
			for (const extension of extensions) {
				let lastDirName = path.basename(extension);
				const versions = getDirectories(extension);
				directories.push(...versions);
				extPathMap[lastDirName] = {
					extensionDir: extension,
					versionsDir: [...versions],
				}
			}
		}
	}
	return [directories, extPathMap];
}

/**
 * Given an extension name, finds and returns the directory containing
 * that extension.
 * @param {string} name - the extension name
 * @returns {string} the extension directory
 */
function findChromeExtension(name, extId) {
	const [directories, extPathMap] = getExtensionDirectories();
	if (!directories) return null
	for (const directory of directories) {
		const file = path.join(directory, 'manifest.json');
		if (isFile(file)) {
			const json = fs.readFileSync(file, { encoding: 'utf8' });
			const manifest = JSON.parse(json);
			if (manifest.name === name) {
				return directory;
			}
		}
	}
	if (extPathMap[extId] && extId) {
		return extPathMap[extId].versionsDir.length === 1 ? extPathMap[extId].versionsDir[0] : extPathMap[extId].extensionDir;
	}
  if (extId) {
    return findChromeExtensionByLocal(name, extId);
  }
  return null
}


function findPreferences() {
	const chrome = getChromeDirectory();
	if (!chrome) return [];
	const names = fs.readdirSync(chrome);
  const directories = ['Secure Preferences', 'Preferences']
	const preferencesfiles = []
	for (const name of names) {
		directories.forEach(item => {
			const abspath = path.join(chrome, name, item);
			if ((name === 'Default') && isFile(abspath)) {
				preferencesfiles.push(abspath)
			}
		})
	}
	return preferencesfiles
}

/**
 * development
 * @param {*} name 
 * @param {*} id 
 * @returns 
 */
function findChromeExtensionByLocal(name, id) {
	const preferencesfiles = findPreferences()
	if (!preferencesfiles || !preferencesfiles.length) return null
	for (const directory of preferencesfiles) {
		const json = fs.readFileSync(directory, { encoding: 'utf8' });
		const manifest = JSON.parse(json);
		if (manifest
			&& manifest.extensions
			&& manifest.extensions.settings
			&& manifest.extensions.settings[id]
			&& manifest.extensions.settings[id].path) {
			return manifest.extensions.settings[id].path
		}
	}
	return null
}

module.exports = findChromeExtension