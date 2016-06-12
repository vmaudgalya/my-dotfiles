Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _jshintSrcCli = require('jshint/src/cli');

var _jshintSrcCli2 = _interopRequireDefault(_jshintSrcCli);

var _userHome = require('user-home');

var _userHome2 = _interopRequireDefault(_userHome);

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
'use babel';
var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x, _x2) {
	var _again = true;

	_function: while (_again) {
		var name = _x,
		    dir = _x2;
		filename = parent = undefined;
		_again = false;

		var filename = _path2['default'].normalize(_path2['default'].join(dir, name));
		if (findFileResults[filename] !== undefined) {
			return findFileResults[filename];
		}

		var parent = _path2['default'].resolve(dir, '../');

		if (_shelljs2['default'].test('-e', filename)) {
			findFileResults[filename] = filename;
			return filename;
		}

		if (dir === parent) {
			findFileResults[filename] = null;
			return null;
		}

		_x = name;
		_x2 = parent;
		_again = true;
		continue _function;
	}
};

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
var findConfig = function findConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var home = _path2['default'].normalize(_path2['default'].join(_userHome2['default'], '.jshintrc'));

	var proj = findFile('.jshintrc', dir);
	if (proj) {
		return proj;
	}

	if (_shelljs2['default'].test('-e', home)) {
		return home;
	}

	return null;
};

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
var loadNpmConfig = function loadNpmConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var fp = findFile('package.json', dir);

	if (!fp) {
		return null;
	}

	try {
		return require(fp).jshintConfig;
	} catch (e) {
		return null;
	}
};
// / //

var loadConfigIfValid = function loadConfigIfValid(filename) {
	var strip = require('strip-json-comments');
	try {
		JSON.parse(strip(_fs2['default'].readFileSync(filename, 'utf8')));
		return _jshintSrcCli2['default'].loadConfig(filename);
	} catch (e) {}
	return {};
};

var loadConfig = function loadConfig(file) {
	var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
	if (config && config.dirname) {
		delete config.dirname;
	}
	return config;
};

exports['default'] = loadConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2pzaGludC9sb2FkLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBQ2UsSUFBSTs7OztvQkFDRixNQUFNOzs7O3VCQUNOLFNBQVM7Ozs7NEJBQ1YsZ0JBQWdCOzs7O3dCQUNYLFdBQVc7Ozs7Ozs7O0FBTGhDLFdBQVcsQ0FBQztBQVdaLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7O0FBWTNCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUTs7OzJCQUFrQjtNQUFkLElBQUk7TUFBRSxHQUFHO0FBQ3BCLFVBQVEsR0FLUixNQUFNOzs7QUFMWixNQUFNLFFBQVEsR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELE1BQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUM1QyxVQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNqQzs7QUFFRCxNQUFNLE1BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxNQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDOUIsa0JBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDckMsVUFBTyxRQUFRLENBQUM7R0FDaEI7O0FBRUQsTUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO0FBQ25CLGtCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLFVBQU8sSUFBSSxDQUFDO0dBQ1o7O09BRWUsSUFBSTtRQUFFLE1BQU07OztFQUM1QjtDQUFBLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJLEVBQUk7QUFDMUIsS0FBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLEtBQU0sSUFBSSxHQUFHLGtCQUFLLFNBQVMsQ0FBQyxrQkFBSyxJQUFJLHdCQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0FBRTlELEtBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsS0FBSSxJQUFJLEVBQUU7QUFDVCxTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELEtBQUkscUJBQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtBQUMxQixTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELFFBQU8sSUFBSSxDQUFDO0NBQ1osQ0FBQzs7Ozs7Ozs7OztBQVVGLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBRyxJQUFJLEVBQUk7QUFDN0IsS0FBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLEtBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXpDLEtBQUksQ0FBQyxFQUFFLEVBQUU7QUFDUixTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELEtBQUk7QUFDSCxTQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7RUFDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNYLFNBQU8sSUFBSSxDQUFDO0VBQ1o7Q0FDRCxDQUFDOzs7QUFHRixJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFHLFFBQVEsRUFBSTtBQUNyQyxLQUFNLEtBQUssR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3QyxLQUFJO0FBQ0gsTUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsU0FBTywwQkFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNYO0FBQ0QsUUFBTyxFQUFFLENBQUM7Q0FDVixDQUFDOztBQUVGLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUksRUFBSTtBQUMxQixLQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUUsS0FBSSxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUM3QixTQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7RUFDdEI7QUFDRCxRQUFPLE1BQU0sQ0FBQztDQUNkLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvanNoaW50L2xvYWQtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgc2hqcyBmcm9tICdzaGVsbGpzJztcbmltcG9ydCBjbGkgZnJvbSAnanNoaW50L3NyYy9jbGknO1xuaW1wb3J0IHVzZXJIb21lIGZyb20gJ3VzZXItaG9tZSc7XG5cbi8vIGZyb20gSlNIaW50IC8vXG4vLyBTdG9yYWdlIGZvciBtZW1vaXplZCByZXN1bHRzIGZyb20gZmluZCBmaWxlXG4vLyBTaG91bGQgcHJldmVudCBsb3RzIG9mIGRpcmVjdG9yeSB0cmF2ZXJzYWwgJlxuLy8gbG9va3VwcyB3aGVuIGxpbml0aW5nIGFuIGVudGlyZSBwcm9qZWN0XG5jb25zdCBmaW5kRmlsZVJlc3VsdHMgPSB7fTtcblxuLyoqXG4gKiBTZWFyY2hlcyBmb3IgYSBmaWxlIHdpdGggYSBzcGVjaWZpZWQgbmFtZSBzdGFydGluZyB3aXRoXG4gKiAnZGlyJyBhbmQgZ29pbmcgYWxsIHRoZSB3YXkgdXAgZWl0aGVyIHVudGlsIGl0IGZpbmRzIHRoZSBmaWxlXG4gKiBvciBoaXRzIHRoZSByb290LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGZpbGVuYW1lIHRvIHNlYXJjaCBmb3IgKGUuZy4gLmpzaGludHJjKVxuICogQHBhcmFtIHtzdHJpbmd9IGRpciAgZGlyZWN0b3J5IHRvIHN0YXJ0IHNlYXJjaCBmcm9tXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gbm9ybWFsaXplZCBmaWxlbmFtZVxuICovXG5jb25zdCBmaW5kRmlsZSA9IChuYW1lLCBkaXIpID0+IHtcblx0Y29uc3QgZmlsZW5hbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oZGlyLCBuYW1lKSk7XG5cdGlmIChmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXTtcblx0fVxuXG5cdGNvbnN0IHBhcmVudCA9IHBhdGgucmVzb2x2ZShkaXIsICcuLi8nKTtcblxuXHRpZiAoc2hqcy50ZXN0KCctZScsIGZpbGVuYW1lKSkge1xuXHRcdGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBmaWxlbmFtZTtcblx0XHRyZXR1cm4gZmlsZW5hbWU7XG5cdH1cblxuXHRpZiAoZGlyID09PSBwYXJlbnQpIHtcblx0XHRmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdID0gbnVsbDtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBmaW5kRmlsZShuYW1lLCBwYXJlbnQpO1xufTtcblxuLyoqXG4gKiBUcmllcyB0byBmaW5kIGEgY29uZmlndXJhdGlvbiBmaWxlIGluIGVpdGhlciBwcm9qZWN0IGRpcmVjdG9yeVxuICogb3IgaW4gdGhlIGhvbWUgZGlyZWN0b3J5LiBDb25maWd1cmF0aW9uIGZpbGVzIGFyZSBuYW1lZFxuICogJy5qc2hpbnRyYycuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGUgcGF0aCB0byB0aGUgZmlsZSB0byBiZSBsaW50ZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGEgcGF0aCB0byB0aGUgY29uZmlnIGZpbGVcbiAqL1xuY29uc3QgZmluZENvbmZpZyA9IGZpbGUgPT4ge1xuXHRjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcblx0Y29uc3QgaG9tZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbih1c2VySG9tZSwgJy5qc2hpbnRyYycpKTtcblxuXHRjb25zdCBwcm9qID0gZmluZEZpbGUoJy5qc2hpbnRyYycsIGRpcik7XG5cdGlmIChwcm9qKSB7XG5cdFx0cmV0dXJuIHByb2o7XG5cdH1cblxuXHRpZiAoc2hqcy50ZXN0KCctZScsIGhvbWUpKSB7XG5cdFx0cmV0dXJuIGhvbWU7XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogVHJpZXMgdG8gZmluZCBKU0hpbnQgY29uZmlndXJhdGlvbiB3aXRoaW4gYSBwYWNrYWdlLmpzb24gZmlsZVxuICogKGlmIGFueSkuIEl0IHNlYXJjaCBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgYW5kIHRoZW4gZ29lcyB1cFxuICogYWxsIHRoZSB3YXkgdG8gdGhlIHJvb3QganVzdCBsaWtlIGZpbmRGaWxlLlxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmd9IGZpbGUgcGF0aCB0byB0aGUgZmlsZSB0byBiZSBsaW50ZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IGNvbmZpZyBvYmplY3RcbiAqL1xuY29uc3QgbG9hZE5wbUNvbmZpZyA9IGZpbGUgPT4ge1xuXHRjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcblx0Y29uc3QgZnAgPSBmaW5kRmlsZSgncGFja2FnZS5qc29uJywgZGlyKTtcblxuXHRpZiAoIWZwKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHR0cnkge1xuXHRcdHJldHVybiByZXF1aXJlKGZwKS5qc2hpbnRDb25maWc7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcbi8vIC8gLy9cblxuY29uc3QgbG9hZENvbmZpZ0lmVmFsaWQgPSBmaWxlbmFtZSA9PiB7XG5cdGNvbnN0IHN0cmlwID0gcmVxdWlyZSgnc3RyaXAtanNvbi1jb21tZW50cycpO1xuXHR0cnkge1xuXHRcdEpTT04ucGFyc2Uoc3RyaXAoZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpKSk7XG5cdFx0cmV0dXJuIGNsaS5sb2FkQ29uZmlnKGZpbGVuYW1lKTtcblx0fSBjYXRjaCAoZSkge1xuXHR9XG5cdHJldHVybiB7fTtcbn07XG5cbmNvbnN0IGxvYWRDb25maWcgPSBmaWxlID0+IHtcblx0Y29uc3QgY29uZmlnID0gbG9hZE5wbUNvbmZpZyhmaWxlKSB8fCBsb2FkQ29uZmlnSWZWYWxpZChmaW5kQ29uZmlnKGZpbGUpKTtcblx0aWYgKGNvbmZpZyAmJiBjb25maWcuZGlybmFtZSkge1xuXHRcdGRlbGV0ZSBjb25maWcuZGlybmFtZTtcblx0fVxuXHRyZXR1cm4gY29uZmlnO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZENvbmZpZztcbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/jshint/load-config.js
