(function() {
  var Color, ColorExpression, createVariableRegExpString;

  Color = require('./color');

  createVariableRegExpString = require('./regexes').createVariableRegExpString;

  module.exports = ColorExpression = (function() {
    ColorExpression.colorExpressionForContext = function(context) {
      return this.colorExpressionForColorVariables(context.getColorVariables());
    };

    ColorExpression.colorExpressionRegexpForColorVariables = function(colorVariables) {
      return createVariableRegExpString(colorVariables);
    };

    ColorExpression.colorExpressionForColorVariables = function(colorVariables) {
      var paletteRegexpString;
      paletteRegexpString = this.colorExpressionRegexpForColorVariables(colorVariables);
      return new ColorExpression({
        name: 'pigments:variables',
        regexpString: paletteRegexpString,
        scopes: ['*'],
        priority: 1,
        handle: function(match, expression, context) {
          var baseColor, evaluated, name, _;
          _ = match[0], _ = match[1], name = match[2];
          if (name == null) {
            name = match[0];
          }
          evaluated = context.readColorExpression(name);
          if (evaluated === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(evaluated);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (context.isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        }
      });
    };

    function ColorExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.scopes = _arg.scopes, this.priority = _arg.priority, this.handle = _arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      color = new Color();
      color.colorExpression = expression;
      color.expressionHandler = this.name;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, results, _ref;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (_ref = re.exec(text), match = _ref[0], _ref) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWV4cHJlc3Npb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNDLDZCQUE4QixPQUFBLENBQVEsV0FBUixFQUE5QiwwQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsZUFBQyxDQUFBLHlCQUFELEdBQTRCLFNBQUMsT0FBRCxHQUFBO2FBQzFCLElBQUMsQ0FBQSxnQ0FBRCxDQUFrQyxPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQUFsQyxFQUQwQjtJQUFBLENBQTVCLENBQUE7O0FBQUEsSUFHQSxlQUFDLENBQUEsc0NBQUQsR0FBeUMsU0FBQyxjQUFELEdBQUE7YUFDdkMsMEJBQUEsQ0FBMkIsY0FBM0IsRUFEdUM7SUFBQSxDQUh6QyxDQUFBOztBQUFBLElBTUEsZUFBQyxDQUFBLGdDQUFELEdBQW1DLFNBQUMsY0FBRCxHQUFBO0FBQ2pDLFVBQUEsbUJBQUE7QUFBQSxNQUFBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxzQ0FBRCxDQUF3QyxjQUF4QyxDQUF0QixDQUFBO2FBRUksSUFBQSxlQUFBLENBQ0Y7QUFBQSxRQUFBLElBQUEsRUFBTSxvQkFBTjtBQUFBLFFBQ0EsWUFBQSxFQUFjLG1CQURkO0FBQUEsUUFFQSxNQUFBLEVBQVEsQ0FBQyxHQUFELENBRlI7QUFBQSxRQUdBLFFBQUEsRUFBVSxDQUhWO0FBQUEsUUFJQSxNQUFBLEVBQVEsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixPQUFwQixHQUFBO0FBQ04sY0FBQSw2QkFBQTtBQUFBLFVBQUMsWUFBRCxFQUFJLFlBQUos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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-expression.coffee
