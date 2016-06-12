(function() {
  var BlendModes, Color, ColorContext, ColorExpression, ColorParser, SVGColors, clamp, clampInt, comma, float, floatOrPercent, hexadecimal, int, intOrPercent, namePrefixes, notQuote, optionalPercent, path, pe, percent, ps, split, variables, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  Color = require('./color');

  ColorParser = null;

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  BlendModes = require('./blend-modes');

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
      var lastRealValue, realValue, _ref2, _ref3;
      _ref2 = [], realValue = _ref2[0], lastRealValue = _ref2[1];
      while (realValue = (_ref3 = this.vars[value]) != null ? _ref3.value : void 0) {
        this.usedVariables.push(value);
        value = lastRealValue = realValue;
      }
      return lastRealValue;
    };

    ColorContext.prototype.getColorValue = function(value) {
      var lastRealValue, realValue, _ref2, _ref3;
      _ref2 = [], realValue = _ref2[0], lastRealValue = _ref2[1];
      while (realValue = (_ref3 = this.colorVars[value]) != null ? _ref3.value : void 0) {
        this.usedVariables.push(value);
        value = lastRealValue = realValue;
      }
      return lastRealValue;
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
      realValue = this.readColorExpression(value);
      if (realValue == null) {
        return;
      }
      scope = this.colorVars[value] != null ? path.extname(this.colorVars[value].path) : '*';
      result = this.parser.parse(realValue, scope, false);
      if (result != null) {
        if (result.invalid && (this.defaultColorVars[realValue] != null)) {
          this.usedVariables.push(realValue);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWNvbnRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNQQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxJQUZkLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxPQUEyQixPQUFBLENBQVEsU0FBUixDQUEzQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLGdCQUFBLFFBTmYsQ0FBQTs7QUFBQSxFQU9BLFFBY0ksT0FBQSxDQUFRLFdBQVIsQ0FkSixFQUNFLFlBQUEsR0FERixFQUVFLGNBQUEsS0FGRixFQUdFLGdCQUFBLE9BSEYsRUFJRSx3QkFBQSxlQUpGLEVBS0UscUJBQUEsWUFMRixFQU1FLHVCQUFBLGNBTkYsRUFPRSxjQUFBLEtBUEYsRUFRRSxpQkFBQSxRQVJGLEVBU0Usb0JBQUEsV0FURixFQVVFLFdBQUEsRUFWRixFQVdFLFdBQUEsRUFYRixFQVlFLGtCQUFBLFNBWkYsRUFhRSxxQkFBQSxZQXBCRixDQUFBOztBQUFBLEVBdUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNCQUFDLE9BQUQsR0FBQTtBQUNYLFVBQUEsa0VBQUE7O1FBRFksVUFBUTtPQUNwQjtBQUFB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-context.coffee
