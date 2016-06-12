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
          var baseColor, name, _;
          _ = match[0], name = match[1];
          if (context.readColorExpression(name) === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(name);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWV4cHJlc3Npb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNDLDZCQUE4QixPQUFBLENBQVEsV0FBUixFQUE5QiwwQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsZUFBQyxDQUFBLHlCQUFELEdBQTRCLFNBQUMsT0FBRCxHQUFBO2FBQzFCLElBQUMsQ0FBQSxnQ0FBRCxDQUFrQyxPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQUFsQyxFQUQwQjtJQUFBLENBQTVCLENBQUE7O0FBQUEsSUFHQSxlQUFDLENBQUEsc0NBQUQsR0FBeUMsU0FBQyxjQUFELEdBQUE7YUFDdkMsMEJBQUEsQ0FBMkIsY0FBM0IsRUFEdUM7SUFBQSxDQUh6QyxDQUFBOztBQUFBLElBTUEsZUFBQyxDQUFBLGdDQUFELEdBQW1DLFNBQUMsY0FBRCxHQUFBO0FBQ2pDLFVBQUEsbUJBQUE7QUFBQSxNQUFBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxzQ0FBRCxDQUF3QyxjQUF4QyxDQUF0QixDQUFBO2FBRUksSUFBQSxlQUFBLENBQ0Y7QUFBQSxRQUFBLElBQUEsRUFBTSxvQkFBTjtBQUFBLFFBQ0EsWUFBQSxFQUFjLG1CQURkO0FBQUEsUUFFQSxNQUFBLEVBQVEsQ0FBQyxHQUFELENBRlI7QUFBQSxRQUdBLFFBQUEsRUFBVSxDQUhWO0FBQUEsUUFJQSxNQUFBLEVBQVEsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixPQUFwQixHQUFBO0FBQ04sY0FBQSxrQkFBQTtBQUFBLFVBQUMsWUFBRCxFQUFHLGVBQUgs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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-expression.coffee
