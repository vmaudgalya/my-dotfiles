(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = function() {
    var DEFINITIONS, VARIABLE_PATTERN, VARIABLE_TYPES, path;
    path = require('path');
    VARIABLE_PATTERN = '\\{{ VARIABLE }}[\\s]*\\:[\\s]*([^\\;\\n]+)[\\;|\\n]';
    VARIABLE_TYPES = [
      {
        type: 'sass',
        extensions: ['.scss', '.sass'],
        regExp: /([\$])([\w0-9-_]+)/i
      }, {
        type: 'less',
        extensions: ['.less'],
        regExp: /([\@])([\w0-9-_]+)/i
      }, {
        type: 'stylus',
        extensions: ['.stylus', '.styl'],
        regExp: /([\$])([\w0-9-_]+)/i
      }
    ];
    DEFINITIONS = {};
    return {
      find: function(string, pathName) {
        var SmartVariable, extensions, regExp, type, _fn, _i, _j, _len, _len1, _match, _matches, _ref, _ref1, _variables;
        SmartVariable = this;
        _variables = [];
        for (_i = 0, _len = VARIABLE_TYPES.length; _i < _len; _i++) {
          _ref = VARIABLE_TYPES[_i], type = _ref.type, extensions = _ref.extensions, regExp = _ref.regExp;
          _matches = string.match(new RegExp(regExp.source, 'ig'));
          if (!_matches) {
            continue;
          }
          if (pathName) {
            if (_ref1 = path.extname(pathName), __indexOf.call(extensions, _ref1) < 0) {
              continue;
            }
          }
          _fn = function(type, extensions, _match) {
            var _index;
            if ((_index = string.indexOf(_match)) === -1) {
              return;
            }
            _variables.push({
              match: _match,
              type: type,
              extensions: extensions,
              start: _index,
              end: _index + _match.length,
              getDefinition: function() {
                return SmartVariable.getDefinition(this);
              },
              isVariable: true
            });
            return string = string.replace(_match, (new Array(_match.length + 1)).join(' '));
          };
          for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
            _match = _matches[_j];
            _fn(type, extensions, _match);
          }
        }
        return _variables;
      },
      getDefinition: function(variable, initial) {
        var extensions, match, type, _definition, _options, _pointer, _regExp, _results;
        match = variable.match, type = variable.type, extensions = variable.extensions;
        _regExp = new RegExp(VARIABLE_PATTERN.replace('{{ VARIABLE }}', match));
        if (_definition = DEFINITIONS[match]) {
          if (initial == null) {
            initial = _definition;
          }
          _pointer = _definition.pointer;
          return atom.project.bufferForPath(_pointer.filePath).then((function(_this) {
            return function(buffer) {
              var _found, _match, _text;
              _text = buffer.getTextInRange(_pointer.range);
              _match = _text.match(_regExp);
              if (!_match) {
                DEFINITIONS[match] = null;
                return _this.getDefinition(variable, initial);
              }
              _definition.value = _match[1];
              _found = (_this.find(_match[1], _pointer.filePath))[0];
              if (_found && _found.isVariable) {
                return _this.getDefinition(_found, initial);
              }
              return {
                value: _definition.value,
                variable: _definition.variable,
                type: _definition.type,
                pointer: initial.pointer
              };
            };
          })(this))["catch"]((function(_this) {
            return function(error) {
              return console.error(error);
            };
          })(this));
        }
        _options = {
          paths: (function() {
            var _extension, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = extensions.length; _i < _len; _i++) {
              _extension = extensions[_i];
              _results.push("**/*" + _extension);
            }
            return _results;
          })()
        };
        _results = [];
        return atom.workspace.scan(_regExp, _options, function(result) {
          return _results.push(result);
        }).then((function(_this) {
          return function() {
            var i, pathFragment, result, _bestMatch, _bestMatchHits, _i, _j, _len, _len1, _match, _pathFragments, _targetFragments, _targetPath, _thisMatchHits;
            _targetPath = atom.workspace.getActivePaneItem().getPath();
            _targetFragments = _targetPath.split(path.sep);
            _bestMatch = null;
            _bestMatchHits = 0;
            for (_i = 0, _len = _results.length; _i < _len; _i++) {
              result = _results[_i];
              _thisMatchHits = 0;
              _pathFragments = result.filePath.split(path.sep);
              for (i = _j = 0, _len1 = _pathFragments.length; _j < _len1; i = ++_j) {
                pathFragment = _pathFragments[i];
                if (pathFragment === _targetFragments[i]) {
                  _thisMatchHits++;
                }
              }
              if (_thisMatchHits > _bestMatchHits) {
                _bestMatch = result;
                _bestMatchHits = _thisMatchHits;
              }
            }
            if (!(_bestMatch && (_match = _bestMatch.matches[0]))) {
              return;
            }
            DEFINITIONS[match] = {
              value: null,
              variable: match,
              type: type,
              pointer: {
                filePath: _bestMatch.filePath,
                range: _match.range
              }
            };
            if (initial == null) {
              initial = DEFINITIONS[match];
            }
            return _this.getDefinition(variable, initial);
          };
        })(this))["catch"]((function(_this) {
          return function(error) {
            return console.error(error);
          };
        })(this));
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL1NtYXJ0VmFyaWFibGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxNQUFBLHFKQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO0FBQ2IsUUFBQSxtREFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTtBQUFBLElBS0EsZ0JBQUEsR0FBbUIsc0RBTG5CLENBQUE7QUFBQSxJQU9BLGNBQUEsR0FBaUI7TUFHYjtBQUFBLFFBQ0ksSUFBQSxFQUFNLE1BRFY7QUFBQSxRQUVJLFVBQUEsRUFBWSxDQUFDLE9BQUQsRUFBVSxPQUFWLENBRmhCO0FBQUEsUUFHSSxNQUFBLEVBQVEscUJBSFo7T0FIYSxFQVdiO0FBQUEsUUFDSSxJQUFBLEVBQU0sTUFEVjtBQUFBLFFBRUksVUFBQSxFQUFZLENBQUMsT0FBRCxDQUZoQjtBQUFBLFFBR0ksTUFBQSxFQUFRLHFCQUhaO09BWGEsRUFtQmI7QUFBQSxRQUNJLElBQUEsRUFBTSxRQURWO0FBQUEsUUFFSSxVQUFBLEVBQVksQ0FBQyxTQUFELEVBQVksT0FBWixDQUZoQjtBQUFBLFFBR0ksTUFBQSxFQUFRLHFCQUhaO09BbkJhO0tBUGpCLENBQUE7QUFBQSxJQW9DQSxXQUFBLEdBQWMsRUFwQ2QsQ0FBQTtBQXlDQSxXQUFPO0FBQUEsTUFPSCxJQUFBLEVBQU0sU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ0YsWUFBQSw0R0FBQTtBQUFBLFFBQUEsYUFBQSxHQUFnQixJQUFoQixDQUFBO0FBQUEsUUFDQSxVQUFBLEdBQWEsRUFEYixDQUFBO0FBR0EsYUFBQSxxREFBQSxHQUFBO0FBQ0kscUNBREMsWUFBQSxNQUFNLGtC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

//# sourceURL=/Users/vmaudgalya/.atom/packages/color-picker/lib/modules/SmartVariable.coffee
