(function() {
  var ColorExpression, Emitter, ExpressionsRegistry, vm,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  ColorExpression = require('./color-expression');

  vm = require('vm');

  module.exports = ExpressionsRegistry = (function() {
    ExpressionsRegistry.deserialize = function(serializedData, expressionsType) {
      var data, handle, name, registry, _ref;
      registry = new ExpressionsRegistry(expressionsType);
      _ref = serializedData.expressions;
      for (name in _ref) {
        data = _ref[name];
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"), {
          console: console,
          require: require
        });
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpStrings['none'] = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType) {
      this.expressionsType = expressionsType;
      this.colorExpressions = {};
      this.emitter = new Emitter;
      this.regexpStrings = {};
    }

    ExpressionsRegistry.prototype.dispose = function() {
      return this.emitter.dispose();
    };

    ExpressionsRegistry.prototype.onDidAddExpression = function(callback) {
      return this.emitter.on('did-add-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidRemoveExpression = function(callback) {
      return this.emitter.on('did-remove-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidUpdateExpressions = function(callback) {
      return this.emitter.on('did-update-expressions', callback);
    };

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var _ref, _results;
        _ref = this.colorExpressions;
        _results = [];
        for (k in _ref) {
          e = _ref[k];
          _results.push(e);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpressionsForScope = function(scope) {
      var expressions;
      expressions = this.getExpressions();
      if (scope === '*') {
        return expressions;
      }
      return expressions.filter(function(e) {
        return __indexOf.call(e.scopes, '*') >= 0 || __indexOf.call(e.scopes, scope) >= 0;
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      var _base;
      return (_base = this.regexpStrings)['none'] != null ? _base['none'] : _base['none'] = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      var _base;
      return (_base = this.regexpStrings)[scope] != null ? _base[scope] : _base[scope] = this.getExpressionsForScope(scope).map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, scopes, handle) {
      var newExpression;
      if (priority == null) {
        priority = 0;
      }
      if (scopes == null) {
        scopes = ['*'];
      }
      if (typeof priority === 'function') {
        handle = priority;
        scopes = ['*'];
        priority = 0;
      } else if (typeof priority === 'object') {
        if (typeof scopes === 'function') {
          handle = scopes;
        }
        scopes = priority;
        priority = 0;
      }
      if (!(scopes.length === 1 && scopes[0] === '*')) {
        scopes.push('pigments');
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        scopes: scopes,
        priority: priority,
        handle: handle
      });
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression, batch) {
      if (batch == null) {
        batch = false;
      }
      this.regexpStrings = {};
      this.colorExpressions[expression.name] = expression;
      if (!batch) {
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
        this.emitter.emit('did-update-expressions', {
          name: expression.name,
          registry: this
        });
      }
      return expression;
    };

    ExpressionsRegistry.prototype.createExpressions = function(expressions) {
      return this.addExpressions(expressions.map((function(_this) {
        return function(e) {
          var expression, handle, name, priority, regexpString, scopes;
          name = e.name, regexpString = e.regexpString, handle = e.handle, priority = e.priority, scopes = e.scopes;
          if (priority == null) {
            priority = 0;
          }
          expression = new _this.expressionsType({
            name: name,
            regexpString: regexpString,
            scopes: scopes,
            handle: handle
          });
          expression.priority = priority;
          return expression;
        };
      })(this)));
    };

    ExpressionsRegistry.prototype.addExpressions = function(expressions) {
      var expression, _i, _len;
      for (_i = 0, _len = expressions.length; _i < _len; _i++) {
        expression = expressions[_i];
        this.addExpression(expression, true);
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
      }
      return this.emitter.emit('did-update-expressions', {
        registry: this
      });
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      delete this.colorExpressions[name];
      this.regexpStrings = {};
      this.emitter.emit('did-remove-expression', {
        name: name,
        registry: this
      });
      return this.emitter.emit('did-update-expressions', {
        name: name,
        registry: this
      });
    };

    ExpressionsRegistry.prototype.serialize = function() {
      var expression, key, out, _ref, _ref1;
      out = {
        regexpString: this.getRegExp(),
        expressions: {}
      };
      _ref = this.colorExpressions;
      for (key in _ref) {
        expression = _ref[key];
        out.expressions[key] = {
          name: expression.name,
          regexpString: expression.regexpString,
          priority: expression.priority,
          scopes: expression.scopes,
          handle: (_ref1 = expression.handle) != null ? _ref1.toString() : void 0
        };
      }
      return out;
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2V4cHJlc3Npb25zLXJlZ2lzdHJ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxjQUFELEVBQWlCLGVBQWpCLEdBQUE7QUFDWixVQUFBLGtDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixlQUFwQixDQUFmLENBQUE7QUFFQTtBQUFBLFdBQUEsWUFBQTswQkFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxtQkFBaEMsQ0FBbkIsRUFBeUU7QUFBQSxVQUFDLFNBQUEsT0FBRDtBQUFBLFVBQVUsU0FBQSxPQUFWO1NBQXpFLENBQVQsQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLElBQUksQ0FBQyxZQUFyQyxFQUFtRCxJQUFJLENBQUMsUUFBeEQsRUFBa0UsSUFBSSxDQUFDLE1BQXZFLEVBQStFLE1BQS9FLENBREEsQ0FERjtBQUFBLE9BRkE7QUFBQSxNQU1BLFFBQVEsQ0FBQyxhQUFjLENBQUEsTUFBQSxDQUF2QixHQUFpQyxjQUFjLENBQUMsWUFOaEQsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/expressions-registry.coffee
