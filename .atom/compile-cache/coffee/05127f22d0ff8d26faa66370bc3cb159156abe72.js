(function() {
  var BlendModes, Color, ColorContext, ColorExpression, ColorParser, SVGColors, clamp, clampInt, comma, float, floatOrPercent, hexadecimal, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, scopeFromFileName, split, variables, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Color = require('./color');

  ColorParser = null;

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  BlendModes = require('./blend-modes');

  scopeFromFileName = require('./scope-from-file-name');

  _ref = require('./utils'), split = _ref.split, clamp = _ref.clamp, clampInt = _ref.clampInt;

  _ref1 = require('./regexes'), int = _ref1.int, float = _ref1.float, percent = _ref1.percent, optionalPercent = _ref1.optionalPercent, intOrPercent = _ref1.intOrPercent, floatOrPercent = _ref1.floatOrPercent, comma = _ref1.comma, notQuote = _ref1.notQuote, hexadecimal = _ref1.hexadecimal, ps = _ref1.ps, pe = _ref1.pe, variables = _ref1.variables, namePrefixes = _ref1.namePrefixes;

  module.exports = ColorContext = (function() {
    function ColorContext(options) {
      var colorVariables, expr, sorted, v, _i, _j, _len, _len1, _ref2, _ref3;
      if (options == null) {
        options = {};
      }
      this.sortPaths = __bind(this.sortPaths, this);
      variables = options.variables, colorVariables = options.colorVariables, this.referenceVariable = options.referenceVariable, this.referencePath = options.referencePath, this.rootPaths = options.rootPaths, this.parser = options.parser, this.colorVars = options.colorVars, this.vars = options.vars, this.defaultVars = options.defaultVars, this.defaultColorVars = options.defaultColorVars, sorted = options.sorted, this.registry = options.registry;
      if (variables == null) {
        variables = [];
      }
      if (colorVariables == null) {
        colorVariables = [];
      }
      if (this.rootPaths == null) {
        this.rootPaths = [];
      }
      if (this.referenceVariable != null) {
        if (this.referencePath == null) {
          this.referencePath = this.referenceVariable.path;
        }
      }
      if (this.sorted) {
        this.variables = variables;
        this.colorVariables = colorVariables;
      } else {
        this.variables = variables.slice().sort(this.sortPaths);
        this.colorVariables = colorVariables.slice().sort(this.sortPaths);
      }
      if (this.vars == null) {
        this.vars = {};
        this.colorVars = {};
        this.defaultVars = {};
        this.defaultColorVars = {};
        _ref2 = this.variables;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          v = _ref2[_i];
          this.vars[v.name] = v;
          if (v.path.match(/\/.pigments$/)) {
            this.defaultVars[v.name] = v;
          }
        }
        _ref3 = this.colorVariables;
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          v = _ref3[_j];
          this.colorVars[v.name] = v;
          if (v.path.match(/\/.pigments$/)) {
            this.defaultColorVars[v.name] = v;
          }
        }
      }
      if ((this.registry.getExpression('pigments:variables') == null) && this.colorVariables.length > 0) {
        expr = ColorExpression.colorExpressionForColorVariables(this.colorVariables);
        this.registry.addExpression(expr);
      }
      if (this.parser == null) {
        ColorParser = require('./color-parser');
        this.parser = new ColorParser(this.registry, this);
      }
      this.usedVariables = [];
    }

    ColorContext.prototype.sortPaths = function(a, b) {
      var rootA, rootB, rootReference;
      if (this.referencePath != null) {
        if (a.path === b.path) {
          return 0;
        }
        if (a.path === this.referencePath) {
          return 1;
        }
        if (b.path === this.referencePath) {
          return -1;
        }
        rootReference = this.rootPathForPath(this.referencePath);
        rootA = this.rootPathForPath(a.path);
        rootB = this.rootPathForPath(b.path);
        if (rootA === rootB) {
          return 0;
        }
        if (rootA === rootReference) {
          return 1;
        }
        if (rootB === rootReference) {
          return -1;
        }
        return 0;
      } else {
        return 0;
      }
    };

    ColorContext.prototype.rootPathForPath = function(path) {
      var root, _i, _len, _ref2;
      _ref2 = this.rootPaths;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        root = _ref2[_i];
        if (path.indexOf("" + root + "/") === 0) {
          return root;
        }
      }
    };

    ColorContext.prototype.clone = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        referenceVariable: this.referenceVariable,
        parser: this.parser,
        vars: this.vars,
        colorVars: this.colorVars,
        defaultVars: this.defaultVars,
        defaultColorVars: this.defaultColorVars,
        sorted: true
      });
    };

    ColorContext.prototype.containsVariable = function(variableName) {
      return __indexOf.call(this.getVariablesNames(), variableName) >= 0;
    };

    ColorContext.prototype.hasColorVariables = function() {
      return this.colorVariables.length > 0;
    };

    ColorContext.prototype.getVariables = function() {
      return this.variables;
    };

    ColorContext.prototype.getColorVariables = function() {
      return this.colorVariables;
    };

    ColorContext.prototype.getVariablesNames = function() {
      return this.varNames != null ? this.varNames : this.varNames = Object.keys(this.vars);
    };

    ColorContext.prototype.getVariablesCount = function() {
      return this.varCount != null ? this.varCount : this.varCount = this.getVariablesNames().length;
    };

    ColorContext.prototype.readUsedVariables = function() {
      var usedVariables, v, _i, _len, _ref2;
      usedVariables = [];
      _ref2 = this.usedVariables;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        v = _ref2[_i];
        if (__indexOf.call(usedVariables, v) < 0) {
          usedVariables.push(v);
        }
      }
      this.usedVariables = [];
      return usedVariables;
    };

    ColorContext.prototype.getValue = function(value) {
      var lastRealValue, lookedUpValues, realValue, _ref2, _ref3;
      _ref2 = [], realValue = _ref2[0], lastRealValue = _ref2[1];
      lookedUpValues = [value];
      while ((realValue = (_ref3 = this.vars[value]) != null ? _ref3.value : void 0) && __indexOf.call(lookedUpValues, realValue) < 0) {
        this.usedVariables.push(value);
        value = lastRealValue = realValue;
        lookedUpValues.push(realValue);
      }
      if (__indexOf.call(lookedUpValues, realValue) >= 0) {
        return void 0;
      } else {
        return lastRealValue;
      }
    };

    ColorContext.prototype.readColorExpression = function(value) {
      if (this.colorVars[value] != null) {
        this.usedVariables.push(value);
        return this.colorVars[value].value;
      } else {
        return value;
      }
    };

    ColorContext.prototype.readColor = function(value, keepAllVariables) {
      var realValue, result, scope, _ref2;
      if (keepAllVariables == null) {
        keepAllVariables = false;
      }
      if (__indexOf.call(this.usedVariables, value) >= 0) {
        return;
      }
      realValue = this.readColorExpression(value);
      if ((realValue == null) || __indexOf.call(this.usedVariables, realValue) >= 0) {
        return;
      }
      scope = this.colorVars[value] != null ? scopeFromFileName(this.colorVars[value].path) : '*';
      this.usedVariables = this.usedVariables.filter(function(v) {
        return v !== realValue;
      });
      result = this.parser.parse(realValue, scope, false);
      if (result != null) {
        if (result.invalid && (this.defaultColorVars[realValue] != null)) {
          result = this.readColor(this.defaultColorVars[realValue].value);
          value = realValue;
        }
      } else if (this.defaultColorVars[value] != null) {
        this.usedVariables.push(value);
        result = this.readColor(this.defaultColorVars[value].value);
      } else {
        if (this.vars[value] != null) {
          this.usedVariables.push(value);
        }
      }
      if ((result != null) && (keepAllVariables || __indexOf.call(this.usedVariables, value) < 0)) {
        result.variables = ((_ref2 = result.variables) != null ? _ref2 : []).concat(this.readUsedVariables());
      }
      return result;
    };

    ColorContext.prototype.readFloat = function(value) {
      var res;
      res = parseFloat(value);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readFloat(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readInt = function(value, base) {
      var res;
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.vars[value].value);
      }
      if (isNaN(res) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        res = this.readInt(this.defaultVars[value].value);
      }
      return res;
    };

    ColorContext.prototype.readPercent = function(value) {
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readPercent(this.defaultVars[value].value);
      }
      return Math.round(parseFloat(value) * 2.55);
    };

    ColorContext.prototype.readIntOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readIntOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return NaN;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    };

    ColorContext.prototype.readFloatOrPercent = function(value) {
      var res;
      if (!/\d+/.test(value) && (this.vars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.vars[value].value);
      }
      if (!/\d+/.test(value) && (this.defaultVars[value] != null)) {
        this.usedVariables.push(value);
        value = this.readFloatOrPercent(this.defaultVars[value].value);
      }
      if (value == null) {
        return NaN;
      }
      if (typeof value === 'number') {
        return value;
      }
      if (value.indexOf('%') !== -1) {
        res = parseFloat(value) / 100;
      } else {
        res = parseFloat(value);
        if (res > 1) {
          res = res / 100;
        }
        res;
      }
      return res;
    };

    ColorContext.prototype.SVGColors = SVGColors;

    ColorContext.prototype.Color = Color;

    ColorContext.prototype.BlendModes = BlendModes;

    ColorContext.prototype.split = function(value) {
      return split(value);
    };

    ColorContext.prototype.clamp = function(value) {
      return clamp(value);
    };

    ColorContext.prototype.clampInt = function(value) {
      return clampInt(value);
    };

    ColorContext.prototype.isInvalid = function(color) {
      return !(color != null ? color.isValid() : void 0);
    };

    ColorContext.prototype.readParam = function(param, block) {
      var name, re, value, _, _ref2;
      re = RegExp("\\$(\\w+):\\s*((-?" + this.float + ")|" + this.variablesRE + ")");
      if (re.test(param)) {
        _ref2 = re.exec(param), _ = _ref2[0], name = _ref2[1], value = _ref2[2];
        return block(name, value);
      }
    };

    ColorContext.prototype.contrast = function(base, dark, light, threshold) {
      var _ref2;
      if (dark == null) {
        dark = new Color('black');
      }
      if (light == null) {
        light = new Color('white');
      }
      if (threshold == null) {
        threshold = 0.43;
      }
      if (dark.luma > light.luma) {
        _ref2 = [dark, light], light = _ref2[0], dark = _ref2[1];
      }
      if (base.luma > threshold) {
        return dark;
      } else {
        return light;
      }
    };

    ColorContext.prototype.mixColors = function(color1, color2, amount, round) {
      var color, inverse;
      if (amount == null) {
        amount = 0.5;
      }
      if (round == null) {
        round = Math.floor;
      }
      if (!((color1 != null) && (color2 != null) && !isNaN(amount))) {
        return new Color(NaN, NaN, NaN, NaN);
      }
      inverse = 1 - amount;
      color = new Color;
      color.rgba = [round(color1.red * amount + color2.red * inverse), round(color1.green * amount + color2.green * inverse), round(color1.blue * amount + color2.blue * inverse), color1.alpha * amount + color2.alpha * inverse];
      return color;
    };

    ColorContext.prototype.int = int;

    ColorContext.prototype.float = float;

    ColorContext.prototype.percent = percent;

    ColorContext.prototype.optionalPercent = optionalPercent;

    ColorContext.prototype.intOrPercent = intOrPercent;

    ColorContext.prototype.floatOrPercent = floatOrPercent;

    ColorContext.prototype.comma = comma;

    ColorContext.prototype.notQuote = notQuote;

    ColorContext.prototype.hexadecimal = hexadecimal;

    ColorContext.prototype.ps = ps;

    ColorContext.prototype.pe = pe;

    ColorContext.prototype.variablesRE = variables;

    ColorContext.prototype.namePrefixes = namePrefixes;

    return ColorContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWNvbnRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLG1RQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLElBRGQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsT0FBMkIsT0FBQSxDQUFRLFNBQVIsQ0FBM0IsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsRUFBZSxnQkFBQSxRQU5mLENBQUE7O0FBQUEsRUFPQSxRQWNJLE9BQUEsQ0FBUSxXQUFSLENBZEosRUFDRSxZQUFBLEdBREYsRUFFRSxjQUFBLEtBRkYsRUFHRSxnQkFBQSxPQUhGLEVBSUUsd0JBQUEsZUFKRixFQUtFLHFCQUFBLFlBTEYsRUFNRSx1QkFBQSxjQU5GLEVBT0UsY0FBQSxLQVBGLEVBUUUsaUJBQUEsUUFSRixFQVNFLG9CQUFBLFdBVEYsRUFVRSxXQUFBLEVBVkYsRUFXRSxXQUFBLEVBWEYsRUFZRSxrQkFBQSxTQVpGLEVBYUUscUJBQUEsWUFwQkYsQ0FBQTs7QUFBQSxFQXVCQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxzQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLGtFQUFBOztRQURZLFVBQVE7T0FDcEI7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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-context.coffee
