(function() {
  var Color, ColorContext, ColorExpression, ColorParser;

  Color = require('./color');

  ColorExpression = require('./color-expression');

  ColorContext = require('./color-context');

  module.exports = ColorParser = (function() {
    function ColorParser(registry, context) {
      this.registry = registry;
      this.context = context;
    }

    ColorParser.prototype.parse = function(expression, scope, collectVariables) {
      var e, res, _i, _len, _ref;
      if (scope == null) {
        scope = '*';
      }
      if (collectVariables == null) {
        collectVariables = true;
      }
      if ((expression == null) || expression === '') {
        return void 0;
      }
      _ref = this.registry.getExpressionsForScope(scope);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.match(expression)) {
          res = e.parse(expression, this.context);
          if (collectVariables) {
            res.variables = this.context.readUsedVariables();
          }
          return res;
        }
      }
      return void 0;
    };

    return ColorParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLXBhcnNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsaURBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FGZixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUUsUUFBRixFQUFhLE9BQWIsR0FBQTtBQUF1QixNQUF0QixJQUFDLENBQUEsV0FBQSxRQUFxQixDQUFBO0FBQUEsTUFBWCxJQUFDLENBQUEsVUFBQSxPQUFVLENBQXZCO0lBQUEsQ0FBYjs7QUFBQSwwQkFFQSxLQUFBLEdBQU8sU0FBQyxVQUFELEVBQWEsS0FBYixFQUF3QixnQkFBeEIsR0FBQTtBQUNMLFVBQUEsc0JBQUE7O1FBRGtCLFFBQU07T0FDeEI7O1FBRDZCLG1CQUFpQjtPQUM5QztBQUFBLE1BQUEsSUFBd0Isb0JBQUosSUFBbUIsVUFBQSxLQUFjLEVBQXJEO0FBQUEsZUFBTyxNQUFQLENBQUE7T0FBQTtBQUVBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsSUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBSDtBQUNFLFVBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUixFQUFvQixJQUFDLENBQUEsT0FBckIsQ0FBTixDQUFBO0FBQ0EsVUFBQSxJQUFnRCxnQkFBaEQ7QUFBQSxZQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBQVQsQ0FBQSxDQUFoQixDQUFBO1dBREE7QUFFQSxpQkFBTyxHQUFQLENBSEY7U0FERjtBQUFBLE9BRkE7QUFRQSxhQUFPLE1BQVAsQ0FUSztJQUFBLENBRlAsQ0FBQTs7dUJBQUE7O01BTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/color-parser.coffee
