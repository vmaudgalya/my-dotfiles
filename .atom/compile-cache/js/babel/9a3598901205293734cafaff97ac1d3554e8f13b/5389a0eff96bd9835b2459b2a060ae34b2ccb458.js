Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _eventKit = require('event-kit');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lazyReq = require('lazy-req');

var _lazyReq2 = _interopRequireDefault(_lazyReq);

var lazyReq = (0, _lazyReq2['default'])(require);
var lodash = lazyReq('lodash');
var jshint = lazyReq('jshint');
var jsxhint = lazyReq('jshint-jsx');
var cli = lazyReq('jshint/src/cli');
var loadConfig = lazyReq('./load-config');
var markersByEditorId = {};
var errorsByEditorId = {};

var subscriptionTooltips = new _eventKit.CompositeDisposable();
var subscriptionEvents = new _eventKit.CompositeDisposable();

var _ = undefined;
var statusBar = undefined;

var SUPPORTED_GRAMMARS = ['source.js', 'source.jsx', 'source.js.jsx'];

var currentLine = undefined;
var currentChar = undefined;

var goToError = function goToError() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !currentLine || !currentChar) {
		return;
	}

	editor.setCursorBufferPosition([currentLine - 1, currentChar - 1]);
};

var jsHintStatusBar = document.createElement('a');
jsHintStatusBar.setAttribute('id', 'jshint-statusbar');
jsHintStatusBar.classList.add('inline-block');
jsHintStatusBar.addEventListener('click', goToError);

var updateStatusText = function updateStatusText(line, character, reason) {
	jsHintStatusBar.textContent = line && character && reason ? 'JSHint ' + line + ':' + character + ' ' + reason : '';
	currentLine = line;
	currentChar = character;
};

var getMarkersForEditor = function getMarkersForEditor(editor) {
	if (editor && markersByEditorId[editor.id]) {
		return markersByEditorId[editor.id];
	}

	return {};
};

var getErrorsForEditor = function getErrorsForEditor(editor) {
	if (errorsByEditorId[editor.id]) {
		return errorsByEditorId[editor.id];
	}

	return [];
};

var destroyMarkerAtRow = function destroyMarkerAtRow(editor, row) {
	if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
		markersByEditorId[editor.id][row].destroy();
		delete markersByEditorId[editor.id][row];
	}
};

var getRowForError = function getRowForError(error) {
	// JSHint reports `line: 0` when config error
	var line = error[0].line || 1;

	var row = line - 1;

	return row;
};

var clearOldMarkers = function clearOldMarkers(editor, errors) {
	subscriptionTooltips.dispose();
	subscriptionTooltips = new _eventKit.CompositeDisposable();

	var rows = _.map(errors, function (error) {
		return getRowForError(error);
	});

	var oldMarkers = getMarkersForEditor(editor);
	_.each(_.keys(oldMarkers), function (row) {
		if (!_.contains(rows, row)) {
			destroyMarkerAtRow(editor, row);
		}
	});
};

var saveMarker = function saveMarker(editor, marker, row) {
	if (!markersByEditorId[editor.id]) {
		markersByEditorId[editor.id] = {};
	}

	markersByEditorId[editor.id][row] = marker;
};

var getMarkerAtRow = function getMarkerAtRow(editor, row) {
	if (!markersByEditorId[editor.id]) {
		return null;
	}

	return markersByEditorId[editor.id][row];
};

var updateStatusbar = function updateStatusbar() {
	if (!statusBar) {
		return;
	}

	if (!jsHintStatusBar.parentNode) {
		statusBar.addLeftTile({ item: jsHintStatusBar });
	}

	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !errorsByEditorId[editor.id]) {
		updateStatusText();
		return;
	}

	var line = editor.getCursorBufferPosition().row + 1;
	var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
	error = Array.isArray(error) ? error[0] : {};

	updateStatusText(error.line, error.character, error.reason);
};

var goToNextError = function goToNextError() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor || !markersByEditorId[editor.id] || !errorsByEditorId[editor.id]) {
		return;
	}

	var cursorRow = editor.getCursorBufferPosition().row;

	var markerRows = _.sortBy(_.map(_.keys(getMarkersForEditor(editor)), function (x) {
		return Number(x);
	}));
	var nextRow = _.find(markerRows, function (x) {
		return x > cursorRow;
	});
	if (!nextRow) {
		nextRow = _.first(markerRows);
	}
	if (!nextRow) {
		return;
	}

	var errors = errorsByEditorId[editor.id][nextRow + 1];
	if (errors) {
		editor.setCursorBufferPosition([nextRow, errors[0].character - 1]);
	}
};

var getReasonsForError = function getReasonsForError(error) {
	return _.map(error, function (el) {
		return el.character + ': ' + el.reason + ' (' + el.code + ')';
	});
};

var addReasons = function addReasons(editor, marker, error) {
	var row = getRowForError(error);
	var editorElement = atom.views.getView(editor);
	var reasons = '<div class="jshint-errors">' + getReasonsForError(error).join('<br>') + '</div>';
	var target = editorElement.shadowRoot.querySelectorAll('.jshint-line-number.line-number-' + row);
	var tooltip = atom.tooltips.add(target, {
		title: reasons,
		placement: 'bottom',
		delay: { show: 200 }
	});

	subscriptionTooltips.add(tooltip);
};

var displayError = function displayError(editor, err) {
	var row = getRowForError(err);

	if (getMarkerAtRow(editor, row)) {
		return;
	}

	var marker = editor.markBufferRange([[row, 0], [row, 1]]);
	editor.decorateMarker(marker, { type: 'line', 'class': 'jshint-line' });
	editor.decorateMarker(marker, { type: 'line-number', 'class': 'jshint-line-number' });
	saveMarker(editor, marker, row);
	addReasons(editor, marker, err);
};

var displayErrors = function displayErrors(editor) {
	var errors = _.compact(getErrorsForEditor(editor));
	clearOldMarkers(editor, errors);
	updateStatusbar();
	_.each(errors, function (err) {
		return displayError(editor, err);
	});
};

var removeMarkersForEditorId = function removeMarkersForEditorId(id) {
	if (markersByEditorId[id]) {
		delete markersByEditorId[id];
	}
};

var removeErrorsForEditorId = function removeErrorsForEditorId(id) {
	if (errorsByEditorId[id]) {
		delete errorsByEditorId[id];
	}
};

var lint = function lint() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
		return;
	}

	var file = editor.getURI();

	// Hack to make JSHint look for .jshintignore in the correct dir
	// Because JSHint doesn't use its `cwd` option
	process.chdir(_path2['default'].dirname(file));

	// Remove errors and don't lint if file is ignored in .jshintignore
	if (file && cli().gather({ args: [file] }).length === 0) {
		removeErrorsForEditorId(editor.id);
		displayErrors(editor);
		removeMarkersForEditorId(editor.id);
		return;
	}

	var config = file ? loadConfig()(file) : {};
	var linter = atom.config.get('jshint.supportLintingJsx') || atom.config.get('jshint.transformJsx') ? jsxhint().JSXHINT : jshint().JSHINT;

	if (Object.keys(config).length === 0 && atom.config.get('jshint.onlyConfig')) {
		return;
	}

	try {
		linter(editor.getText(), config, config.globals);
	} catch (err) {}

	removeErrorsForEditorId(editor.id);

	// workaround the errors array sometimes containing `null`
	var errors = _.compact(linter.errors);

	if (errors.length > 0) {
		(function () {
			// aggregate same-line errors
			var ret = [];
			_.each(errors, function (el) {
				var l = el.line;

				if (Array.isArray(ret[l])) {
					ret[l].push(el);

					ret[l] = _.sortBy(ret[l], function (el) {
						return el.character;
					});
				} else {
					ret[l] = [el];
				}
			});

			errorsByEditorId[editor.id] = ret;
		})();
	}

	displayErrors(editor);
};

var debouncedLint = null;
var debouncedDisplayErrors = null;
var debouncedUpdateStatusbar = null;

var registerEvents = function registerEvents() {
	subscriptionEvents.dispose();
	subscriptionEvents = new _eventKit.CompositeDisposable();

	updateStatusbar();

	var editor = atom.workspace.getActiveTextEditor();
	if (!editor) {
		return;
	}

	displayErrors(editor);

	if (!atom.config.get('jshint.validateOnlyOnSave')) {
		subscriptionEvents.add(editor.onDidChange(debouncedLint));
		debouncedLint();
	}

	subscriptionEvents.add(editor.onDidSave(debouncedLint));
	subscriptionEvents.add(editor.onDidChangeScrollTop(function () {
		return debouncedDisplayErrors(editor);
	}));
	subscriptionEvents.add(editor.onDidChangeCursorPosition(debouncedUpdateStatusbar));

	subscriptionEvents.add(editor.onDidDestroy(function () {
		removeErrorsForEditorId(editor.id);
		displayErrors(editor);
		removeMarkersForEditorId(editor.id);
	}));
};

var config = {
	onlyConfig: {
		type: 'boolean',
		'default': false,
		description: 'Disable linter if there is no config file found for the linter.'
	},
	validateOnlyOnSave: {
		type: 'boolean',
		'default': false
	},
	supportLintingJsx: {
		type: 'boolean',
		'default': false,
		title: 'Support Linting JSX'
	}
};

exports.config = config;
var subscriptionMain = null;

var activate = function activate() {
	_ = lodash();
	debouncedLint = _.debounce(lint, 200);
	debouncedDisplayErrors = _.debounce(displayErrors, 200);
	debouncedUpdateStatusbar = _.debounce(updateStatusbar, 100);

	subscriptionMain = new _eventKit.CompositeDisposable();
	subscriptionMain.add(atom.workspace.observeActivePaneItem(registerEvents));
	subscriptionMain.add(atom.config.observe('jshint.validateOnlyOnSave', registerEvents));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:lint', lint));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:go-to-error', goToError));
	subscriptionMain.add(atom.commands.add('atom-workspace', 'jshint:go-to-next-error', goToNextError));
};

exports.activate = activate;
var deactivate = function deactivate() {
	subscriptionTooltips.dispose();
	subscriptionEvents.dispose();
	subscriptionMain.dispose();
};

exports.deactivate = deactivate;
var consumeStatusBar = function consumeStatusBar(instance) {
	return statusBar = instance;
};
exports.consumeStatusBar = consumeStatusBar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92bWF1ZGdhbHlhLy5hdG9tL3BhY2thZ2VzL2pzaGludC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozt3QkFDa0MsV0FBVzs7b0JBQzVCLE1BQU07Ozs7dUJBQ0MsVUFBVTs7OztBQUVsQyxJQUFNLE9BQU8sR0FBRywwQkFBWSxPQUFPLENBQUMsQ0FBQztBQUNyQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsSUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDN0IsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7O0FBRTVCLElBQUksb0JBQW9CLEdBQUcsbUNBQXlCLENBQUM7QUFDckQsSUFBSSxrQkFBa0IsR0FBRyxtQ0FBeUIsQ0FBQzs7QUFFbkQsSUFBSSxDQUFDLFlBQUEsQ0FBQztBQUNOLElBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsSUFBTSxrQkFBa0IsR0FBRyxDQUMxQixXQUFXLEVBQ1gsWUFBWSxFQUNaLGVBQWUsQ0FDZixDQUFDOztBQUVGLElBQUksV0FBVyxZQUFBLENBQUM7QUFDaEIsSUFBSSxXQUFXLFlBQUEsQ0FBQzs7QUFFaEIsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLEdBQVM7QUFDdkIsS0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxLQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzVDLFNBQU87RUFDUDs7QUFF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VXNlcnMvdm1hdWRnYWx5YS8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsYXp5UmVxdWlyZSBmcm9tICdsYXp5LXJlcSc7XG5cbmNvbnN0IGxhenlSZXEgPSBsYXp5UmVxdWlyZShyZXF1aXJlKTtcbmNvbnN0IGxvZGFzaCA9IGxhenlSZXEoJ2xvZGFzaCcpO1xuY29uc3QganNoaW50ID0gbGF6eVJlcSgnanNoaW50Jyk7XG5jb25zdCBqc3hoaW50ID0gbGF6eVJlcSgnanNoaW50LWpzeCcpO1xuY29uc3QgY2xpID0gbGF6eVJlcSgnanNoaW50L3NyYy9jbGknKTtcbmNvbnN0IGxvYWRDb25maWcgPSBsYXp5UmVxKCcuL2xvYWQtY29uZmlnJyk7XG5jb25zdCBtYXJrZXJzQnlFZGl0b3JJZCA9IHt9O1xuY29uc3QgZXJyb3JzQnlFZGl0b3JJZCA9IHt9O1xuXG5sZXQgc3Vic2NyaXB0aW9uVG9vbHRpcHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xubGV0IHN1YnNjcmlwdGlvbkV2ZW50cyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbmxldCBfO1xubGV0IHN0YXR1c0JhcjtcblxuY29uc3QgU1VQUE9SVEVEX0dSQU1NQVJTID0gW1xuXHQnc291cmNlLmpzJyxcblx0J3NvdXJjZS5qc3gnLFxuXHQnc291cmNlLmpzLmpzeCdcbl07XG5cbmxldCBjdXJyZW50TGluZTtcbmxldCBjdXJyZW50Q2hhcjtcblxuY29uc3QgZ29Ub0Vycm9yID0gKCkgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKCFlZGl0b3IgfHwgIWN1cnJlbnRMaW5lIHx8ICFjdXJyZW50Q2hhcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbY3VycmVudExpbmUgLSAxLCBjdXJyZW50Q2hhciAtIDFdKTtcbn07XG5cbmNvbnN0IGpzSGludFN0YXR1c0JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbmpzSGludFN0YXR1c0Jhci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2pzaGludC1zdGF0dXNiYXInKTtcbmpzSGludFN0YXR1c0Jhci5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKTtcbmpzSGludFN0YXR1c0Jhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdvVG9FcnJvcik7XG5cbmNvbnN0IHVwZGF0ZVN0YXR1c1RleHQgPSAobGluZSwgY2hhcmFjdGVyLCByZWFzb24pID0+IHtcblx0anNIaW50U3RhdHVzQmFyLnRleHRDb250ZW50ID0gbGluZSAmJiBjaGFyYWN0ZXIgJiYgcmVhc29uID8gYEpTSGludCAke2xpbmV9OiR7Y2hhcmFjdGVyfSAke3JlYXNvbn1gIDogJyc7XG5cdGN1cnJlbnRMaW5lID0gbGluZTtcblx0Y3VycmVudENoYXIgPSBjaGFyYWN0ZXI7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJzRm9yRWRpdG9yID0gZWRpdG9yID0+IHtcblx0aWYgKGVkaXRvciAmJiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBnZXRFcnJvcnNGb3JFZGl0b3IgPSBlZGl0b3IgPT4ge1xuXHRpZiAoZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuIGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXTtcblx0fVxuXG5cdHJldHVybiBbXTtcbn07XG5cbmNvbnN0IGRlc3Ryb3lNYXJrZXJBdFJvdyA9IChlZGl0b3IsIHJvdykgPT4ge1xuXHRpZiAobWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSAmJiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10pIHtcblx0XHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10uZGVzdHJveSgpO1xuXHRcdGRlbGV0ZSBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd107XG5cdH1cbn07XG5cbmNvbnN0IGdldFJvd0ZvckVycm9yID0gZXJyb3IgPT4ge1xuXHQvLyBKU0hpbnQgcmVwb3J0cyBgbGluZTogMGAgd2hlbiBjb25maWcgZXJyb3Jcblx0Y29uc3QgbGluZSA9IGVycm9yWzBdLmxpbmUgfHwgMTtcblxuXHRjb25zdCByb3cgPSBsaW5lIC0gMTtcblxuXHRyZXR1cm4gcm93O1xufTtcblxuY29uc3QgY2xlYXJPbGRNYXJrZXJzID0gKGVkaXRvciwgZXJyb3JzKSA9PiB7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzLmRpc3Bvc2UoKTtcblx0c3Vic2NyaXB0aW9uVG9vbHRpcHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG5cdGNvbnN0IHJvd3MgPSBfLm1hcChlcnJvcnMsIGVycm9yID0+IGdldFJvd0ZvckVycm9yKGVycm9yKSk7XG5cblx0Y29uc3Qgb2xkTWFya2VycyA9IGdldE1hcmtlcnNGb3JFZGl0b3IoZWRpdG9yKTtcblx0Xy5lYWNoKF8ua2V5cyhvbGRNYXJrZXJzKSwgcm93ID0+IHtcblx0XHRpZiAoIV8uY29udGFpbnMocm93cywgcm93KSkge1xuXHRcdFx0ZGVzdHJveU1hcmtlckF0Um93KGVkaXRvciwgcm93KTtcblx0XHR9XG5cdH0pO1xufTtcblxuY29uc3Qgc2F2ZU1hcmtlciA9IChlZGl0b3IsIG1hcmtlciwgcm93KSA9PiB7XG5cdGlmICghbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0gPSB7fTtcblx0fVxuXG5cdG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XSA9IG1hcmtlcjtcbn07XG5cbmNvbnN0IGdldE1hcmtlckF0Um93ID0gKGVkaXRvciwgcm93KSA9PiB7XG5cdGlmICghbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cmV0dXJuIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XTtcbn07XG5cbmNvbnN0IHVwZGF0ZVN0YXR1c2JhciA9ICgpID0+IHtcblx0aWYgKCFzdGF0dXNCYXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoIWpzSGludFN0YXR1c0Jhci5wYXJlbnROb2RlKSB7XG5cdFx0c3RhdHVzQmFyLmFkZExlZnRUaWxlKHtpdGVtOiBqc0hpbnRTdGF0dXNCYXJ9KTtcblx0fVxuXG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIWVkaXRvciB8fCAhZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0dXBkYXRlU3RhdHVzVGV4dCgpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuXHRsZXQgZXJyb3IgPSBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bbGluZV0gfHwgXy5maXJzdChfLmNvbXBhY3QoZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSk7XG5cdGVycm9yID0gQXJyYXkuaXNBcnJheShlcnJvcikgPyBlcnJvclswXSA6IHt9O1xuXG5cdHVwZGF0ZVN0YXR1c1RleHQoZXJyb3IubGluZSwgZXJyb3IuY2hhcmFjdGVyLCBlcnJvci5yZWFzb24pO1xufTtcblxuY29uc3QgZ29Ub05leHRFcnJvciA9ICgpID0+IHtcblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghZWRpdG9yIHx8ICFtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdIHx8ICFlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjdXJzb3JSb3cgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3c7XG5cblx0Y29uc3QgbWFya2VyUm93cyA9IF8uc29ydEJ5KF8ubWFwKF8ua2V5cyhnZXRNYXJrZXJzRm9yRWRpdG9yKGVkaXRvcikpLCB4ID0+IE51bWJlcih4KSkpO1xuXHRsZXQgbmV4dFJvdyA9IF8uZmluZChtYXJrZXJSb3dzLCB4ID0+IHggPiBjdXJzb3JSb3cpO1xuXHRpZiAoIW5leHRSb3cpIHtcblx0XHRuZXh0Um93ID0gXy5maXJzdChtYXJrZXJSb3dzKTtcblx0fVxuXHRpZiAoIW5leHRSb3cpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBlcnJvcnMgPSBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bbmV4dFJvdyArIDFdO1xuXHRpZiAoZXJyb3JzKSB7XG5cdFx0ZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtuZXh0Um93LCBlcnJvcnNbMF0uY2hhcmFjdGVyIC0gMV0pO1xuXHR9XG59O1xuXG5jb25zdCBnZXRSZWFzb25zRm9yRXJyb3IgPSBlcnJvciA9PiB7XG5cdHJldHVybiBfLm1hcChlcnJvciwgZWwgPT4gYCR7ZWwuY2hhcmFjdGVyfTogJHtlbC5yZWFzb259ICgke2VsLmNvZGV9KWApO1xufTtcblxuY29uc3QgYWRkUmVhc29ucyA9IChlZGl0b3IsIG1hcmtlciwgZXJyb3IpID0+IHtcblx0Y29uc3Qgcm93ID0gZ2V0Um93Rm9yRXJyb3IoZXJyb3IpO1xuXHRjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG5cdGNvbnN0IHJlYXNvbnMgPSBgPGRpdiBjbGFzcz1cImpzaGludC1lcnJvcnNcIj4ke2dldFJlYXNvbnNGb3JFcnJvcihlcnJvcikuam9pbignPGJyPicpfTwvZGl2PmA7XG5cdGNvbnN0IHRhcmdldCA9IGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKGAuanNoaW50LWxpbmUtbnVtYmVyLmxpbmUtbnVtYmVyLSR7cm93fWApO1xuXHRjb25zdCB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGFyZ2V0LCB7XG5cdFx0dGl0bGU6IHJlYXNvbnMsXG5cdFx0cGxhY2VtZW50OiAnYm90dG9tJyxcblx0XHRkZWxheToge3Nob3c6IDIwMH1cblx0fSk7XG5cblx0c3Vic2NyaXB0aW9uVG9vbHRpcHMuYWRkKHRvb2x0aXApO1xufTtcblxuY29uc3QgZGlzcGxheUVycm9yID0gKGVkaXRvciwgZXJyKSA9PiB7XG5cdGNvbnN0IHJvdyA9IGdldFJvd0ZvckVycm9yKGVycik7XG5cblx0aWYgKGdldE1hcmtlckF0Um93KGVkaXRvciwgcm93KSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tyb3csIDBdLCBbcm93LCAxXV0pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogJ2pzaGludC1saW5lJ30pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6ICdqc2hpbnQtbGluZS1udW1iZXInfSk7XG5cdHNhdmVNYXJrZXIoZWRpdG9yLCBtYXJrZXIsIHJvdyk7XG5cdGFkZFJlYXNvbnMoZWRpdG9yLCBtYXJrZXIsIGVycik7XG59O1xuXG5jb25zdCBkaXNwbGF5RXJyb3JzID0gZWRpdG9yID0+IHtcblx0Y29uc3QgZXJyb3JzID0gXy5jb21wYWN0KGdldEVycm9yc0ZvckVkaXRvcihlZGl0b3IpKTtcblx0Y2xlYXJPbGRNYXJrZXJzKGVkaXRvciwgZXJyb3JzKTtcblx0dXBkYXRlU3RhdHVzYmFyKCk7XG5cdF8uZWFjaChlcnJvcnMsIGVyciA9PiBkaXNwbGF5RXJyb3IoZWRpdG9yLCBlcnIpKTtcbn07XG5cbmNvbnN0IHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZCA9IGlkID0+IHtcblx0aWYgKG1hcmtlcnNCeUVkaXRvcklkW2lkXSkge1xuXHRcdGRlbGV0ZSBtYXJrZXJzQnlFZGl0b3JJZFtpZF07XG5cdH1cbn07XG5cbmNvbnN0IHJlbW92ZUVycm9yc0ZvckVkaXRvcklkID0gaWQgPT4ge1xuXHRpZiAoZXJyb3JzQnlFZGl0b3JJZFtpZF0pIHtcblx0XHRkZWxldGUgZXJyb3JzQnlFZGl0b3JJZFtpZF07XG5cdH1cbn07XG5cbmNvbnN0IGxpbnQgPSAoKSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIWVkaXRvcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChTVVBQT1JURURfR1JBTU1BUlMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgPT09IC0xKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZmlsZSA9IGVkaXRvci5nZXRVUkkoKTtcblxuXHQvLyBIYWNrIHRvIG1ha2UgSlNIaW50IGxvb2sgZm9yIC5qc2hpbnRpZ25vcmUgaW4gdGhlIGNvcnJlY3QgZGlyXG5cdC8vIEJlY2F1c2UgSlNIaW50IGRvZXNuJ3QgdXNlIGl0cyBgY3dkYCBvcHRpb25cblx0cHJvY2Vzcy5jaGRpcihwYXRoLmRpcm5hbWUoZmlsZSkpO1xuXG5cdC8vIFJlbW92ZSBlcnJvcnMgYW5kIGRvbid0IGxpbnQgaWYgZmlsZSBpcyBpZ25vcmVkIGluIC5qc2hpbnRpZ25vcmVcblx0aWYgKGZpbGUgJiYgY2xpKCkuZ2F0aGVyKHthcmdzOiBbZmlsZV19KS5sZW5ndGggPT09IDApIHtcblx0XHRyZW1vdmVFcnJvcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHRcdGRpc3BsYXlFcnJvcnMoZWRpdG9yKTtcblx0XHRyZW1vdmVNYXJrZXJzRm9yRWRpdG9ySWQoZWRpdG9yLmlkKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjb25maWcgPSBmaWxlID8gbG9hZENvbmZpZygpKGZpbGUpIDoge307XG5cdGNvbnN0IGxpbnRlciA9IChhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC5zdXBwb3J0TGludGluZ0pzeCcpIHx8IGF0b20uY29uZmlnLmdldCgnanNoaW50LnRyYW5zZm9ybUpzeCcpKSA/IGpzeGhpbnQoKS5KU1hISU5UIDoganNoaW50KCkuSlNISU5UO1xuXG5cdGlmIChPYmplY3Qua2V5cyhjb25maWcpLmxlbmd0aCA9PT0gMCAmJiBhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC5vbmx5Q29uZmlnJykpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0cnkge1xuXHRcdGxpbnRlcihlZGl0b3IuZ2V0VGV4dCgpLCBjb25maWcsIGNvbmZpZy5nbG9iYWxzKTtcblx0fSBjYXRjaCAoZXJyKSB7fVxuXG5cdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cblx0Ly8gd29ya2Fyb3VuZCB0aGUgZXJyb3JzIGFycmF5IHNvbWV0aW1lcyBjb250YWluaW5nIGBudWxsYFxuXHRjb25zdCBlcnJvcnMgPSBfLmNvbXBhY3QobGludGVyLmVycm9ycyk7XG5cblx0aWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gYWdncmVnYXRlIHNhbWUtbGluZSBlcnJvcnNcblx0XHRjb25zdCByZXQgPSBbXTtcblx0XHRfLmVhY2goZXJyb3JzLCBlbCA9PiB7XG5cdFx0XHRjb25zdCBsID0gZWwubGluZTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocmV0W2xdKSkge1xuXHRcdFx0XHRyZXRbbF0ucHVzaChlbCk7XG5cblx0XHRcdFx0cmV0W2xdID0gXy5zb3J0QnkocmV0W2xdLCBlbCA9PiBlbC5jaGFyYWN0ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0W2xdID0gW2VsXTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSA9IHJldDtcblx0fVxuXG5cdGRpc3BsYXlFcnJvcnMoZWRpdG9yKTtcbn07XG5cbmxldCBkZWJvdW5jZWRMaW50ID0gbnVsbDtcbmxldCBkZWJvdW5jZWREaXNwbGF5RXJyb3JzID0gbnVsbDtcbmxldCBkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIgPSBudWxsO1xuXG5jb25zdCByZWdpc3RlckV2ZW50cyA9ICgpID0+IHtcblx0c3Vic2NyaXB0aW9uRXZlbnRzLmRpc3Bvc2UoKTtcblx0c3Vic2NyaXB0aW9uRXZlbnRzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuXHR1cGRhdGVTdGF0dXNiYXIoKTtcblxuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cdGlmICghZWRpdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0ZGlzcGxheUVycm9ycyhlZGl0b3IpO1xuXG5cdGlmICghYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQudmFsaWRhdGVPbmx5T25TYXZlJykpIHtcblx0XHRzdWJzY3JpcHRpb25FdmVudHMuYWRkKGVkaXRvci5vbkRpZENoYW5nZShkZWJvdW5jZWRMaW50KSk7XG5cdFx0ZGVib3VuY2VkTGludCgpO1xuXHR9XG5cblx0c3Vic2NyaXB0aW9uRXZlbnRzLmFkZChlZGl0b3Iub25EaWRTYXZlKGRlYm91bmNlZExpbnQpKTtcblx0c3Vic2NyaXB0aW9uRXZlbnRzLmFkZChlZGl0b3Iub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4gZGVib3VuY2VkRGlzcGxheUVycm9ycyhlZGl0b3IpKSk7XG5cdHN1YnNjcmlwdGlvbkV2ZW50cy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyKSk7XG5cblx0c3Vic2NyaXB0aW9uRXZlbnRzLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcblx0XHRyZW1vdmVFcnJvcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHRcdGRpc3BsYXlFcnJvcnMoZWRpdG9yKTtcblx0XHRyZW1vdmVNYXJrZXJzRm9yRWRpdG9ySWQoZWRpdG9yLmlkKTtcblx0fSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcblx0b25seUNvbmZpZzoge1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRkZWZhdWx0OiBmYWxzZSxcblx0XHRkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLidcblx0fSxcblx0dmFsaWRhdGVPbmx5T25TYXZlOiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0sXG5cdHN1cHBvcnRMaW50aW5nSnN4OiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdHRpdGxlOiAnU3VwcG9ydCBMaW50aW5nIEpTWCdcblx0fVxufTtcblxubGV0IHN1YnNjcmlwdGlvbk1haW4gPSBudWxsO1xuXG5leHBvcnQgY29uc3QgYWN0aXZhdGUgPSAoKSA9PiB7XG5cdF8gPSBsb2Rhc2goKTtcblx0ZGVib3VuY2VkTGludCA9IF8uZGVib3VuY2UobGludCwgMjAwKTtcblx0ZGVib3VuY2VkRGlzcGxheUVycm9ycyA9IF8uZGVib3VuY2UoZGlzcGxheUVycm9ycywgMjAwKTtcblx0ZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyID0gXy5kZWJvdW5jZSh1cGRhdGVTdGF0dXNiYXIsIDEwMCk7XG5cblx0c3Vic2NyaXB0aW9uTWFpbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdHN1YnNjcmlwdGlvbk1haW4uYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbShyZWdpc3RlckV2ZW50cykpO1xuXHRzdWJzY3JpcHRpb25NYWluLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdqc2hpbnQudmFsaWRhdGVPbmx5T25TYXZlJywgcmVnaXN0ZXJFdmVudHMpKTtcblx0c3Vic2NyaXB0aW9uTWFpbi5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2pzaGludDpsaW50JywgbGludCkpO1xuXHRzdWJzY3JpcHRpb25NYWluLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnanNoaW50OmdvLXRvLWVycm9yJywgZ29Ub0Vycm9yKSk7XG5cdHN1YnNjcmlwdGlvbk1haW4uYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqc2hpbnQ6Z28tdG8tbmV4dC1lcnJvcicsIGdvVG9OZXh0RXJyb3IpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBkZWFjdGl2YXRlID0gKCkgPT4ge1xuXHRzdWJzY3JpcHRpb25Ub29sdGlwcy5kaXNwb3NlKCk7XG5cdHN1YnNjcmlwdGlvbkV2ZW50cy5kaXNwb3NlKCk7XG5cdHN1YnNjcmlwdGlvbk1haW4uZGlzcG9zZSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnN1bWVTdGF0dXNCYXIgPSBpbnN0YW5jZSA9PiBzdGF0dXNCYXIgPSBpbnN0YW5jZTtcbiJdfQ==
//# sourceURL=/Users/vmaudgalya/.atom/packages/jshint/index.js
