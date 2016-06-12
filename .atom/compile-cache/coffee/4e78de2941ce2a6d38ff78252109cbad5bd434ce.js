(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorContext, ColorMarkerElement, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  minimatch = require('minimatch');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  _ref1 = require('./versions'), SERIALIZE_VERSION = _ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref1.SERIALIZE_MARKERS_VERSION;

  THEME_VARIABLES = require('./uris').THEME_VARIABLES;

  ColorBuffer = require('./color-buffer');

  ColorContext = require('./color-context');

  ColorSearch = require('./color-search');

  Palette = require('./palette');

  PathsLoader = require('./paths-loader');

  PathsScanner = require('./paths-scanner');

  ColorMarkerElement = require('./color-marker-element');

  VariablesCollection = require('./variables-collection');

  ATOM_VARIABLES = ['text-color', 'text-color-subtle', 'text-color-highlight', 'text-color-selected', 'text-color-info', 'text-color-success', 'text-color-warning', 'text-color-error', 'background-color-info', 'background-color-success', 'background-color-warning', 'background-color-error', 'background-color-highlight', 'background-color-selected', 'app-background-color', 'base-background-color', 'base-border-color', 'pane-item-background-color', 'pane-item-border-color', 'input-background-color', 'input-border-color', 'tool-panel-background-color', 'tool-panel-border-color', 'inset-panel-background-color', 'inset-panel-border-color', 'panel-heading-background-color', 'panel-heading-border-color', 'overlay-background-color', 'overlay-border-color', 'button-background-color', 'button-background-color-hover', 'button-background-color-selected', 'button-border-color', 'tab-bar-background-color', 'tab-bar-border-color', 'tab-background-color', 'tab-background-color-active', 'tab-border-color', 'tree-view-background-color', 'tree-view-border-color', 'ui-site-color-1', 'ui-site-color-2', 'ui-site-color-3', 'ui-site-color-4', 'ui-site-color-5', 'syntax-text-color', 'syntax-cursor-color', 'syntax-selection-color', 'syntax-background-color', 'syntax-wrap-guide-color', 'syntax-indent-guide-color', 'syntax-invisible-character-color', 'syntax-result-marker-color', 'syntax-result-marker-color-selected', 'syntax-gutter-text-color', 'syntax-gutter-text-color-selected', 'syntax-gutter-background-color', 'syntax-gutter-background-color-selected', 'syntax-color-renamed', 'syntax-color-added', 'syntax-color-modified', 'syntax-color-removed'];

  compareArray = function(a, b) {
    var i, v, _i, _len;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion;
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if (atom.inDevMode() && atom.project.getPaths().some(function(p) {
        return p.match(/\/pigments$/);
      })) {
        markersVersion += '-dev';
      }
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, defaultScopes, includeThemes, svgColorExpression, timestamp, variables;
      if (state == null) {
        state = {};
      }
      includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.bufferStates = buffers != null ? buffers : {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredBufferNames', (function(_this) {
        return function(ignoredBufferNames) {
          _this.ignoredBufferNames = ignoredBufferNames;
          return _this.updateColorBuffers();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', function(type) {
        if (type != null) {
          return ColorMarkerElement.setMarkerType(type);
        }
      }));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      svgColorExpression = this.colorExpressionsRegistry.getExpression('pigments:named_colors');
      defaultScopes = svgColorExpression.scopes.slice();
      this.subscriptions.add(atom.config.observe('pigments.extendedFiletypesForColorWords', (function(_this) {
        return function(scopes) {
          svgColorExpression.scopes = defaultScopes.concat(scopes);
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            name: svgColorExpression.name,
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(_arg) {
          var colorBuffer, id, name, _ref2, _results;
          name = _arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          _this.variables.evaluateVariables(_this.variables.getVariables());
          _ref2 = _this.colorBuffersByEditorId;
          _results = [];
          for (id in _ref2) {
            colorBuffer = _ref2[id];
            _results.push(colorBuffer.update());
          }
          return _results;
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      if (includeThemes) {
        this.setIncludeThemes(includeThemes);
      }
      this.updateIgnoredFiletypes();
      if ((this.paths != null) && (this.variables.length != null)) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = this.loadPathsAndVariables().then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, _ref2;
      if (this.destroyed) {
        return;
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        buffer = _ref2[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, path, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return __indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
              path = dirtied[_i];
              if (__indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.setColorPickerAPI = function(colorPickerAPI) {
      this.colorPickerAPI = colorPickerAPI;
    };

    ColorProject.prototype.initializeBuffers = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement, editorPath;
          editorPath = editor.getPath();
          if ((editorPath == null) || _this.isBufferIgnored(editorPath)) {
            return;
          }
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.hasColorBufferForEditor = function(editor) {
      if (this.destroyed || (editor == null)) {
        return false;
      }
      return this.colorBuffersByEditorId[editor.id] != null;
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.updateColorBuffers = function() {
      var buffer, bufferElement, e, editor, id, _i, _len, _ref2, _ref3, _results;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        buffer = _ref2[id];
        if (this.isBufferIgnored(buffer.editor.getPath())) {
          buffer.destroy();
          delete this.colorBuffersByEditorId[id];
        }
      }
      try {
        if (this.colorBuffersByEditorId != null) {
          _ref3 = atom.workspace.getTextEditors();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            editor = _ref3[_i];
            if (this.hasColorBufferForEditor(editor) || this.isBufferIgnored(editor.getPath())) {
              continue;
            }
            buffer = this.colorBufferForEditor(editor);
            if (buffer != null) {
              bufferElement = atom.views.getView(buffer);
              _results.push(bufferElement.attach());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };

    ColorProject.prototype.isBufferIgnored = function(path) {
      var source, sources, _i, _len, _ref2;
      path = atom.project.relativize(path);
      sources = (_ref2 = this.ignoredBufferNames) != null ? _ref2 : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
      return false;
    };

    ColorProject.prototype.getPaths = function() {
      var _ref2;
      return (_ref2 = this.paths) != null ? _ref2.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.hasPath = function(path) {
      var _ref2;
      return __indexOf.call((_ref2 = this.paths) != null ? _ref2 : [], path) >= 0;
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, rootPaths, _ref2;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (_ref2 = _this.paths) != null ? _ref2 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, p, _i, _len;
            for (_i = 0, _len = knownPaths.length; _i < _len; _i++) {
              p = knownPaths[_i];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, p, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return __indexOf.call(removed, p) < 0;
          });
          for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
            p = dirtied[_i];
            if (__indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var source, sources, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.getPalette = function() {
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange;
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return __indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        return PathsScanner.startTask(paths, this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, _ref2, _ref3;
      names = ['.pigments'];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((_ref3 = atom.config.get('pigments.sourceNames')) != null ? _ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, _ref2, _ref3, _ref4, _ref5;
      names = [];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      names = names.concat((_ref3 = this.searchNames) != null ? _ref3 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((_ref4 = atom.config.get('pigments.sourceNames')) != null ? _ref4 : []);
        names = names.concat((_ref5 = atom.config.get('pigments.extendedSearchNames')) != null ? _ref5 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, _ref2, _ref3, _ref4;
      names = (_ref2 = this.ignoredNames) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((_ref3 = this.getGlobalIgnoredNames()) != null ? _ref3 : []);
        names = names.concat((_ref4 = atom.config.get('core.ignoredNames')) != null ? _ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var _ref2;
      return (_ref2 = atom.config.get('pigments.ignoredNames')) != null ? _ref2.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames) {
      this.ignoredNames = ignoredNames != null ? ignoredNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return Promise.reject('Project is not initialized yet');
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var scopes, _ref2, _ref3;
      scopes = (_ref2 = this.ignoredScopes) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((_ref3 = atom.config.get('pigments.ignoredScopes')) != null ? _ref3 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, scopes, _ref2, _ref3;
      filetypes = (_ref2 = this.supportedFiletypes) != null ? _ref2 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((_ref3 = atom.config.get('pigments.supportedFiletypes')) != null ? _ref3 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var _ref4;
        return (_ref4 = atom.grammars.selectGrammar("file." + ext)) != null ? _ref4.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
          return function() {
            var variables;
            if (!_this.includeThemes) {
              return;
            }
            variables = _this.loadThemesVariables();
            return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
          };
        })(this));
        this.subscriptions.add(this.themesSubscription);
        return this.variables.addMany(this.loadThemesVariables());
      } else {
        this.subscriptions.remove(this.themesSubscription);
        this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
        return this.themesSubscription.dispose();
      }
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data;
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, _ref2;
      out = {};
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXByb2plY3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJSQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsT0FBd0MsT0FBQSxDQUFRLE1BQVIsQ0FBeEMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixFQUErQixhQUFBLEtBRC9CLENBQUE7O0FBQUEsRUFHQSxRQUFpRCxPQUFBLENBQVEsWUFBUixDQUFqRCxFQUFDLDBCQUFBLGlCQUFELEVBQW9CLGtDQUFBLHlCQUhwQixDQUFBOztBQUFBLEVBSUMsa0JBQW1CLE9BQUEsQ0FBUSxRQUFSLEVBQW5CLGVBSkQsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FMZCxDQUFBOztBQUFBLEVBTUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQU5mLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQVJWLENBQUE7O0FBQUEsRUFTQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBVGQsQ0FBQTs7QUFBQSxFQVVBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FWZixDQUFBOztBQUFBLEVBV0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBWHJCLENBQUE7O0FBQUEsRUFZQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVIsQ0FadEIsQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsQ0FDZixZQURlLEVBRWYsbUJBRmUsRUFH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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-project.coffee
