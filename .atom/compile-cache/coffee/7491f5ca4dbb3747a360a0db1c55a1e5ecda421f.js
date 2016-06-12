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
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"));
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpString = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType) {
      this.expressionsType = expressionsType;
      this.colorExpressions = {};
      this.emitter = new Emitter;
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
      return this.regexpString != null ? this.regexpString : this.regexpString = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      return this.regexpString != null ? this.regexpString : this.regexpString = this.getExpressionsForScope(scope).map(function(e) {
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
      delete this.regexpString;
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
      delete this.regexpString;
      delete this.colorExpressions[name];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2V4cHJlc3Npb25zLXJlZ2lzdHJ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxjQUFELEVBQWlCLGVBQWpCLEdBQUE7QUFDWixVQUFBLGtDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixlQUFwQixDQUFmLENBQUE7QUFFQTtBQUFBLFdBQUEsWUFBQTswQkFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxtQkFBaEMsQ0FBbkIsQ0FBVCxDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBSSxDQUFDLFlBQXJDLEVBQW1ELElBQUksQ0FBQyxRQUF4RCxFQUFrRSxJQUFJLENBQUMsTUFBdkUsRUFBK0UsTUFBL0UsQ0FEQSxDQURGO0FBQUEsT0FGQTtBQUFBLE1BTUEsUUFBUSxDQUFDLFlBQVQsR0FBd0IsY0FBYyxDQUFDLFlBTnZDLENBQUE7YUFRQSxTQVRZO0lBQUEsQ0FBZCxDQUFBOztBQVlhLElBQUEsNkJBQUUsZUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/expressions-registry.coffee
