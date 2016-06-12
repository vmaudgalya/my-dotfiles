(function() {
  var BufferColorsScanner, ColorContext, ColorExpression, ColorScanner, ColorsChunkSize, ExpressionsRegistry, path;

  path = require('path');

  ColorScanner = require('../color-scanner');

  ColorContext = require('../color-context');

  ColorExpression = require('../color-expression');

  ExpressionsRegistry = require('../expressions-registry');

  ColorsChunkSize = 100;

  BufferColorsScanner = (function() {
    function BufferColorsScanner(config) {
      var colorVariables, registry, variables;
      this.buffer = config.buffer, variables = config.variables, colorVariables = config.colorVariables, this.bufferPath = config.bufferPath, registry = config.registry;
      registry = ExpressionsRegistry.deserialize(registry, ColorExpression);
      this.context = new ColorContext({
        variables: variables,
        colorVariables: colorVariables,
        referencePath: this.bufferPath,
        registry: registry
      });
      this.scanner = new ColorScanner({
        context: this.context
      });
      this.results = [];
    }

    BufferColorsScanner.prototype.scan = function() {
      var lastIndex, result, scope;
      scope = path.extname(this.bufferPath);
      lastIndex = 0;
      while (result = this.scanner.search(this.buffer, scope, lastIndex)) {
        this.results.push(result);
        if (this.results.length >= ColorsChunkSize) {
          this.flushColors();
        }
        lastIndex = result.lastIndex;
      }
      return this.flushColors();
    };

    BufferColorsScanner.prototype.flushColors = function() {
      emit('scan-buffer:colors-found', this.results);
      return this.results = [];
    };

    return BufferColorsScanner;

  })();

  module.exports = function(config) {
    return new BufferColorsScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLWNvbG9ycy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0R0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQUp0QixDQUFBOztBQUFBLEVBS0EsZUFBQSxHQUFrQixHQUxsQixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLDZCQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsbUNBQUE7QUFBQSxNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsbUJBQUEsU0FBVixFQUFxQix3QkFBQSxjQUFyQixFQUFxQyxJQUFDLENBQUEsb0JBQUEsVUFBdEMsRUFBa0Qsa0JBQUEsUUFBbEQsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGVBQTFDLENBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLFlBQUEsQ0FBYTtBQUFBLFFBQUMsV0FBQSxTQUFEO0FBQUEsUUFBWSxnQkFBQSxjQUFaO0FBQUEsUUFBNEIsYUFBQSxFQUFlLElBQUMsQ0FBQSxVQUE1QztBQUFBLFFBQXdELFVBQUEsUUFBeEQ7T0FBYixDQUZmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxZQUFBLENBQWE7QUFBQSxRQUFFLFNBQUQsSUFBQyxDQUFBLE9BQUY7T0FBYixDQUhmLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFKWCxDQURXO0lBQUEsQ0FBYjs7QUFBQSxrQ0FPQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSx3QkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFVBQWQsQ0FBUixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksQ0FEWixDQUFBO0FBRUEsYUFBTSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxNQUFqQixFQUF5QixLQUF6QixFQUFnQyxTQUFoQyxDQUFmLEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQsQ0FBQSxDQUFBO0FBRUEsUUFBQSxJQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsSUFBbUIsZUFBckM7QUFBQSxVQUFBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO1NBRkE7QUFBQSxRQUdDLFlBQWEsT0FBYixTQUhELENBREY7TUFBQSxDQUZBO2FBUUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQVRJO0lBQUEsQ0FQTixDQUFBOztBQUFBLGtDQWtCQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFBLENBQUssMEJBQUwsRUFBaUMsSUFBQyxDQUFBLE9BQWxDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FGQTtJQUFBLENBbEJiLENBQUE7OytCQUFBOztNQVJGLENBQUE7O0FBQUEsRUE4QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxNQUFELEdBQUE7V0FDWCxJQUFBLG1CQUFBLENBQW9CLE1BQXBCLENBQTJCLENBQUMsSUFBNUIsQ0FBQSxFQURXO0VBQUEsQ0E5QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-buffer-colors-handler.coffee
