(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  ColorContext = require('./color-context');

  ColorExpression = require('./color-expression');

  Color = require('./color');

  registry = require('./color-expressions');

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      var v, _i, _len, _ref;
      this.emitter = new Emitter;
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      this.dependencyGraph = {};
      if ((state != null ? state.content : void 0) != null) {
        _ref = state.content;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          this.restoreVariable(v);
        }
      }
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var _ref;
      return (_ref = this.variablesByPath[path]) != null ? _ref : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var v, _i, _len, _ref;
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var p, res, _i, _len;
      res = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var _ref;
      return (_ref = this.findAll(properties)) != null ? _ref[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, _ref;
          if (((_ref = v[k]) != null ? _ref.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return __indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, path, pathsCollection, pathsToDestroy, remainingPaths, results, updated, v, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      pathsCollection = {};
      remainingPaths = [];
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        if (pathsCollection[_name = v.path] == null) {
          pathsCollection[_name] = [];
        }
        pathsCollection[v.path].push(v);
        if (_ref = v.path, __indexOf.call(remainingPaths, _ref) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        _ref1 = this.updatePathCollection(path, collection, true) || {}, created = _ref1.created, updated = _ref1.updated, destroyed = _ref1.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return __indexOf.call(remainingPaths, p) < 0;
        });
        for (_j = 0, _len1 = pathsToDestroy.length; _j < _len1; _j++) {
          path = pathsToDestroy[_j];
          _ref2 = this.updatePathCollection(path, collection, true) || {}, created = _ref2.created, updated = _ref2.updated, destroyed = _ref2.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((_ref3 = results.created) != null ? _ref3.length : void 0) === 0) {
        delete results.created;
      }
      if (((_ref4 = results.updated) != null ? _ref4.length : void 0) === 0) {
        delete results.updated;
      }
      if (((_ref5 = results.destroyed) != null ? _ref5.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        _ref6 = results.destroyed;
        for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
          v = _ref6[_k];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, pathCollection, results, status, v, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (_i = 0, _len = pathCollection.length; _i < _len; _i++) {
        v = pathCollection[_i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, status, _ref;
      if (batch == null) {
        batch = false;
      }
      _ref = this.getVariableStatus(variable), status = _ref[0], previousVariable = _ref[1];
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var res, results, status, v, variable, _i, _len;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, results, v, variable, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables) {
      var isColor, updated, v, wasColor, _i, _len;
      updated = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        v = variables[_i];
        wasColor = v.isColor;
        this.evaluateVariableColor(v, wasColor);
        isColor = v.isColor;
        if (isColor !== wasColor) {
          updated.push(v);
          if (isColor) {
            this.buildDependencyGraph(v);
          }
        }
      }
      if (updated.length > 0) {
        return this.emitChangeEvent(this.updateDependencies({
          updated: updated
        }));
      }
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, removed, _ref;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      _ref = this.diffArrays(previousDependencies, newDependencies), removed = _ref.removed, added = _ref.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (__indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var status, v, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, dependencies, dependency, _base, _i, _len, _ref, _results;
      dependencies = this.getVariableDependencies(variable);
      _results = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dependency = dependencies[_i];
        a = (_base = this.dependencyGraph)[dependency] != null ? _base[dependency] : _base[dependency] = [];
        if (_ref = variable.name, __indexOf.call(a, _ref) < 0) {
          _results.push(a.push(variable.name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, v, variables, _i, _len, _ref, _ref1, _ref2;
      dependencies = [];
      if (_ref = variable.value, __indexOf.call(this.variableNames, _ref) >= 0) {
        dependencies.push(variable.value);
      }
      if (((_ref1 = variable.color) != null ? (_ref2 = _ref1.variables) != null ? _ref2.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          v = variables[_i];
          if (__indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var v, variables, _i, _len, _ref, _ref1;
      variables = [];
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (_ref1 = v.name, __indexOf.call(names, _ref1) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            _results.push(delete this.dependencyGraph[v]);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var v, _base, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if ((_base = this.dependencyGraph)[v] == null) {
          _base[v] = [];
        }
        _results.push(this.dependencyGraph[v].push(from));
      }
      return _results;
    };

    VariablesCollection.prototype.updateDependencies = function(_arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, name, updated, variable, variables, _i, _j, _k, _len, _len1, _len2;
      created = _arg.created, updated = _arg.updated, destroyed = _arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (_j = 0, _len1 = dependencies.length; _j < _len1; _j++) {
            name = dependencies[_j];
            if (__indexOf.call(dirtyVariableNames, name) < 0 && __indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (_k = 0, _len2 = dirtyVariables.length; _k < _len2; _k++) {
        variable = dirtyVariables[_k];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(_arg) {
      var created, destroyed, updated;
      created = _arg.created, destroyed = _arg.destroyed, updated = _arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, removed, v, _i, _j, _len, _len1;
      removed = [];
      added = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        v = a[_i];
        if (__indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (_j = 0, _len1 = b.length; _j < _len1; _j++) {
        v = b[_j];
        if (__indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3ZhcmlhYmxlcy1jb2xsZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUhSLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHFCQUFSLENBSlgsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxDQU5ULENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxtQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEIsRUFEUTtJQUFBLENBQWQsQ0FBQTs7QUFBQSxJQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLG1CQUFDLENBQUEsU0FBdkIsRUFBa0MsUUFBbEMsRUFBNEM7QUFBQSxNQUMxQyxHQUFBLEVBQUssU0FBQSxHQUFBO2VBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFkO01BQUEsQ0FEcUM7QUFBQSxNQUUxQyxVQUFBLEVBQVksSUFGOEI7S0FBNUMsQ0FIQSxDQUFBOztBQVFhLElBQUEsNkJBQUMsS0FBRCxHQUFBO0FBQ1gsVUFBQSxpQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/variables-collection.coffee
