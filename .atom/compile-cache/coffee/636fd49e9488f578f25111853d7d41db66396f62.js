(function() {
  var Color, ColorBuffer, ColorExpression, ColorMarker, CompositeDisposable, Emitter, Range, Task, VariablesCollection, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable, Task = _ref.Task, Range = _ref.Range;

  Color = require('./color');

  ColorMarker = require('./color-marker');

  ColorExpression = require('./color-expression');

  VariablesCollection = require('./variables-collection');

  module.exports = ColorBuffer = (function() {
    function ColorBuffer(params) {
      var colorMarkers, _ref1;
      if (params == null) {
        params = {};
      }
      this.editor = params.editor, this.project = params.project, colorMarkers = params.colorMarkers;
      _ref1 = this.editor, this.id = _ref1.id, this.displayBuffer = _ref1.displayBuffer;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.ignoredScopes = [];
      this.colorMarkersByMarkerId = {};
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.editor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          var _ref2;
          return (_ref2 = _this.getColorMarkers()) != null ? _ref2.forEach(function(marker) {
            return marker.checkMarkerScope(true);
          }) : void 0;
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          if (_this.initialized && _this.variableInitialized) {
            _this.terminateRunningTask();
          }
          if (_this.timeout != null) {
            return clearTimeout(_this.timeout);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.delayBeforeScan === 0) {
            return _this.update();
          } else {
            if (_this.timeout != null) {
              clearTimeout(_this.timeout);
            }
            return _this.timeout = setTimeout(function() {
              _this.update();
              return _this.timeout = null;
            }, _this.delayBeforeScan);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangePath((function(_this) {
        return function(path) {
          if (_this.isVariablesSource()) {
            _this.project.appendPath(path);
          }
          return _this.update();
        };
      })(this)));
      this.subscriptions.add(this.project.onDidUpdateVariables((function(_this) {
        return function() {
          if (!_this.variableInitialized) {
            return;
          }
          return _this.scanBufferForColors().then(function(results) {
            return _this.updateColorMarkers(results);
          });
        };
      })(this)));
      this.subscriptions.add(this.project.onDidChangeIgnoredScopes((function(_this) {
        return function() {
          return _this.updateIgnoredScopes();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.delayBeforeScan', (function(_this) {
        return function(delayBeforeScan) {
          _this.delayBeforeScan = delayBeforeScan != null ? delayBeforeScan : 0;
        };
      })(this)));
      this.editor.findMarkers({
        type: 'pigments-variable'
      }).forEach(function(m) {
        return m.destroy();
      });
      if (colorMarkers != null) {
        this.restoreMarkersState(colorMarkers);
        this.cleanUnusedTextEditorMarkers();
      }
      this.updateIgnoredScopes();
      this.initialize();
    }

    ColorBuffer.prototype.onDidUpdateColorMarkers = function(callback) {
      return this.emitter.on('did-update-color-markers', callback);
    };

    ColorBuffer.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorBuffer.prototype.initialize = function() {
      if (this.colorMarkers != null) {
        return Promise.resolve();
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      this.updateVariableRanges();
      this.initializePromise = this.scanBufferForColors().then((function(_this) {
        return function(results) {
          return _this.createColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function(results) {
          _this.colorMarkers = results;
          return _this.initialized = true;
        };
      })(this));
      this.initializePromise.then((function(_this) {
        return function() {
          return _this.variablesAvailable();
        };
      })(this));
      return this.initializePromise;
    };

    ColorBuffer.prototype.restoreMarkersState = function(colorMarkers) {
      this.updateVariableRanges();
      return this.colorMarkers = colorMarkers.filter(function(state) {
        return state != null;
      }).map((function(_this) {
        return function(state) {
          var color, marker, _ref1;
          marker = (_ref1 = _this.editor.getMarker(state.markerId)) != null ? _ref1 : _this.editor.markBufferRange(state.bufferRange, {
            type: 'pigments-color',
            invalidate: 'touch'
          });
          color = new Color(state.color);
          color.variables = state.variables;
          color.invalid = state.invalid;
          return _this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
            marker: marker,
            color: color,
            text: state.text,
            colorBuffer: _this
          });
        };
      })(this));
    };

    ColorBuffer.prototype.cleanUnusedTextEditorMarkers = function() {
      return this.editor.findMarkers({
        type: 'pigments-color'
      }).forEach((function(_this) {
        return function(m) {
          if (_this.colorMarkersByMarkerId[m.id] == null) {
            return m.destroy();
          }
        };
      })(this));
    };

    ColorBuffer.prototype.variablesAvailable = function() {
      if (this.variablesPromise != null) {
        return this.variablesPromise;
      }
      return this.variablesPromise = this.project.initialize().then((function(_this) {
        return function(results) {
          if (_this.destroyed) {
            return;
          }
          if (results == null) {
            return;
          }
          if (_this.isIgnored() && _this.isVariablesSource()) {
            return _this.scanBufferForVariables();
          }
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.variableInitialized = true;
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.update = function() {
      var promise;
      this.terminateRunningTask();
      promise = this.isIgnored() ? this.scanBufferForVariables() : !this.isVariablesSource() ? Promise.resolve([]) : this.project.reloadVariablesForPath(this.editor.getPath());
      return promise.then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.terminateRunningTask = function() {
      var _ref1;
      return (_ref1 = this.task) != null ? _ref1.terminate() : void 0;
    };

    ColorBuffer.prototype.destroy = function() {
      var _ref1;
      if (this.destroyed) {
        return;
      }
      this.terminateRunningTask();
      this.subscriptions.dispose();
      if ((_ref1 = this.colorMarkers) != null) {
        _ref1.forEach(function(marker) {
          return marker.destroy();
        });
      }
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    ColorBuffer.prototype.isVariablesSource = function() {
      return this.project.isVariablesSourcePath(this.editor.getPath());
    };

    ColorBuffer.prototype.isIgnored = function() {
      var p;
      p = this.editor.getPath();
      return this.project.isIgnoredPath(p) || !atom.project.contains(p);
    };

    ColorBuffer.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorBuffer.prototype.getPath = function() {
      return this.editor.getPath();
    };

    ColorBuffer.prototype.updateIgnoredScopes = function() {
      var _ref1;
      this.ignoredScopes = this.project.getIgnoredScopes().map(function(scope) {
        try {
          return new RegExp(scope);
        } catch (_error) {}
      }).filter(function(re) {
        return re != null;
      });
      if ((_ref1 = this.getColorMarkers()) != null) {
        _ref1.forEach(function(marker) {
          return marker.checkMarkerScope(true);
        });
      }
      return this.emitter.emit('did-update-color-markers', {
        created: [],
        destroyed: []
      });
    };

    ColorBuffer.prototype.updateVariableRanges = function() {
      var variablesForBuffer;
      variablesForBuffer = this.project.getVariablesForPath(this.editor.getPath());
      return variablesForBuffer.forEach((function(_this) {
        return function(variable) {
          return variable.bufferRange != null ? variable.bufferRange : variable.bufferRange = Range.fromObject([_this.editor.getBuffer().positionForCharacterIndex(variable.range[0]), _this.editor.getBuffer().positionForCharacterIndex(variable.range[1])]);
        };
      })(this));
    };

    ColorBuffer.prototype.scanBufferForVariables = function() {
      var buffer, config, editor, results, taskPath;
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-variables-handler');
      editor = this.editor;
      buffer = this.editor.getBuffer();
      config = {
        buffer: this.editor.getText(),
        registry: this.project.getVariableExpressionsRegistry().serialize()
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:variables-found', function(variables) {
            return results = results.concat(variables.map(function(variable) {
              variable.path = editor.getPath();
              variable.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
              return variable;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.getColorMarkers = function() {
      return this.colorMarkers;
    };

    ColorBuffer.prototype.getValidColorMarkers = function() {
      var _ref1, _ref2;
      return (_ref1 = (_ref2 = this.getColorMarkers()) != null ? _ref2.filter(function(m) {
        return m.color.isValid();
      }) : void 0) != null ? _ref1 : [];
    };

    ColorBuffer.prototype.getColorMarkerAtBufferPosition = function(bufferPosition) {
      var marker, markers, _i, _len;
      markers = this.editor.findMarkers({
        type: 'pigments-color',
        containsBufferPosition: bufferPosition
      });
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        if (this.colorMarkersByMarkerId[marker.id] != null) {
          return this.colorMarkersByMarkerId[marker.id];
        }
      }
    };

    ColorBuffer.prototype.createColorMarkers = function(results) {
      if (this.destroyed) {
        return Promise.resolve([]);
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var newResults, processResults;
          newResults = [];
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            if (_this.editor.isDestroyed()) {
              return resolve([]);
            }
            while (results.length) {
              result = results.shift();
              marker = _this.editor.markBufferRange(result.bufferRange, {
                type: 'pigments-color',
                invalidate: 'touch'
              });
              newResults.push(_this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
                marker: marker,
                color: result.color,
                text: result.match,
                colorBuffer: _this
              }));
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve(newResults);
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.findExistingMarkers = function(results) {
      var newMarkers, toCreate;
      newMarkers = [];
      toCreate = [];
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var processResults;
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            while (results.length) {
              result = results.shift();
              if (marker = _this.findColorMarker(result)) {
                newMarkers.push(marker);
              } else {
                toCreate.push(result);
              }
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve({
              newMarkers: newMarkers,
              toCreate: toCreate
            });
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.updateColorMarkers = function(results) {
      var createdMarkers, newMarkers;
      newMarkers = null;
      createdMarkers = null;
      return this.findExistingMarkers(results).then((function(_this) {
        return function(_arg) {
          var markers, toCreate;
          markers = _arg.newMarkers, toCreate = _arg.toCreate;
          newMarkers = markers;
          return _this.createColorMarkers(toCreate);
        };
      })(this)).then((function(_this) {
        return function(results) {
          var toDestroy;
          createdMarkers = results;
          newMarkers = newMarkers.concat(results);
          if (_this.colorMarkers != null) {
            toDestroy = _this.colorMarkers.filter(function(marker) {
              return __indexOf.call(newMarkers, marker) < 0;
            });
            toDestroy.forEach(function(marker) {
              delete _this.colorMarkersByMarkerId[marker.id];
              return marker.destroy();
            });
          } else {
            toDestroy = [];
          }
          _this.colorMarkers = newMarkers;
          return _this.emitter.emit('did-update-color-markers', {
            created: createdMarkers,
            destroyed: toDestroy
          });
        };
      })(this));
    };

    ColorBuffer.prototype.findColorMarker = function(properties) {
      var marker, _i, _len, _ref1;
      if (properties == null) {
        properties = {};
      }
      if (this.colorMarkers == null) {
        return;
      }
      _ref1 = this.colorMarkers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        if (marker != null ? marker.match(properties) : void 0) {
          return marker;
        }
      }
    };

    ColorBuffer.prototype.findColorMarkers = function(properties) {
      var markers;
      if (properties == null) {
        properties = {};
      }
      properties.type = 'pigments-color';
      markers = this.editor.findMarkers(properties);
      return markers.map((function(_this) {
        return function(marker) {
          return _this.colorMarkersByMarkerId[marker.id];
        };
      })(this)).filter(function(marker) {
        return marker != null;
      });
    };

    ColorBuffer.prototype.findValidColorMarkers = function(properties) {
      return this.findColorMarkers(properties).filter((function(_this) {
        return function(marker) {
          var _ref1;
          return (marker != null) && ((_ref1 = marker.color) != null ? _ref1.isValid() : void 0) && !(marker != null ? marker.isIgnored() : void 0);
        };
      })(this));
    };

    ColorBuffer.prototype.scanBufferForColors = function(options) {
      var buffer, collection, config, registry, results, taskPath, variables, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (options == null) {
        options = {};
      }
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-colors-handler');
      buffer = this.editor.getBuffer();
      registry = this.project.getColorExpressionsRegistry().serialize();
      if (options.variables != null) {
        collection = new VariablesCollection();
        collection.addMany(options.variables);
        options.variables = collection;
      }
      variables = this.isVariablesSource() ? ((_ref2 = (_ref3 = options.variables) != null ? _ref3.getVariables() : void 0) != null ? _ref2 : []).concat((_ref1 = this.project.getVariables()) != null ? _ref1 : []) : (_ref4 = (_ref5 = options.variables) != null ? _ref5.getVariables() : void 0) != null ? _ref4 : [];
      delete registry.expressions['pigments:variables'];
      delete registry.regexpString;
      config = {
        buffer: this.editor.getText(),
        bufferPath: this.getPath(),
        variables: variables,
        colorVariables: variables.filter(function(v) {
          return v.isColor;
        }),
        registry: registry
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:colors-found', function(colors) {
            return results = results.concat(colors.map(function(res) {
              res.color = new Color(res.color);
              res.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(res.range[0]), buffer.positionForCharacterIndex(res.range[1])]);
              return res;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.serialize = function() {
      var _ref1;
      return {
        id: this.id,
        path: this.editor.getPath(),
        colorMarkers: (_ref1 = this.colorMarkers) != null ? _ref1.map(function(marker) {
          return marker.serialize();
        }) : void 0
      };
    };

    return ColorBuffer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWJ1ZmZlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0hBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQThDLE9BQUEsQ0FBUSxNQUFSLENBQTlDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsRUFBK0IsWUFBQSxJQUEvQixFQUFxQyxhQUFBLEtBQXJDLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSLENBSnRCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLG1CQUFBOztRQURZLFNBQU87T0FDbkI7QUFBQSxNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsSUFBQyxDQUFBLGlCQUFBLE9BQVgsRUFBb0Isc0JBQUEsWUFBcEIsQ0FBQTtBQUFBLE1BQ0EsUUFBd0IsSUFBQyxDQUFBLE1BQXpCLEVBQUMsSUFBQyxDQUFBLFdBQUEsRUFBRixFQUFNLElBQUMsQ0FBQSxzQkFBQSxhQURQLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRlgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFlLEVB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-buffer.coffee
