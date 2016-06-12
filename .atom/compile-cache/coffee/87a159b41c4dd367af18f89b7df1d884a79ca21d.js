(function() {
  var BufferColorsScanner, ColorContext, ColorExpression, ColorScanner, ColorsChunkSize, ExpressionsRegistry, scopeFromFileName;

  ColorScanner = require('../color-scanner');

  ColorContext = require('../color-context');

  ColorExpression = require('../color-expression');

  ExpressionsRegistry = require('../expressions-registry');

  scopeFromFileName = require('../scope-from-file-name');

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
      if (this.bufferPath == null) {
        return;
      }
      scope = scopeFromFileName(this.bufferPath);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLWNvbG9ycy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SEFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixPQUFBLENBQVEseUJBQVIsQ0FKcEIsQ0FBQTs7QUFBQSxFQUtBLGVBQUEsR0FBa0IsR0FMbEIsQ0FBQTs7QUFBQSxFQU9NO0FBQ1MsSUFBQSw2QkFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLG1DQUFBO0FBQUEsTUFBQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLG1CQUFBLFNBQVYsRUFBcUIsd0JBQUEsY0FBckIsRUFBcUMsSUFBQyxDQUFBLG9CQUFBLFVBQXRDLEVBQWtELGtCQUFBLFFBQWxELENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxtQkFBbUIsQ0FBQyxXQUFwQixDQUFnQyxRQUFoQyxFQUEwQyxlQUExQyxDQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxZQUFBLENBQWE7QUFBQSxRQUFDLFdBQUEsU0FBRDtBQUFBLFFBQVksZ0JBQUEsY0FBWjtBQUFBLFFBQTRCLGFBQUEsRUFBZSxJQUFDLENBQUEsVUFBNUM7QUFBQSxRQUF3RCxVQUFBLFFBQXhEO09BQWIsQ0FGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsWUFBQSxDQUFhO0FBQUEsUUFBRSxTQUFELElBQUMsQ0FBQSxPQUFGO09BQWIsQ0FIZixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSlgsQ0FEVztJQUFBLENBQWI7O0FBQUEsa0NBT0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsd0JBQUE7QUFBQSxNQUFBLElBQWMsdUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLGlCQUFBLENBQWtCLElBQUMsQ0FBQSxVQUFuQixDQURSLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxDQUZaLENBQUE7QUFHQSxhQUFNLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDLFNBQWhDLENBQWYsR0FBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxDQUFBLENBQUE7QUFFQSxRQUFBLElBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxJQUFtQixlQUFyQztBQUFBLFVBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7U0FGQTtBQUFBLFFBR0MsWUFBYSxPQUFiLFNBSEQsQ0FERjtNQUFBLENBSEE7YUFTQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBVkk7SUFBQSxDQVBOLENBQUE7O0FBQUEsa0NBbUJBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUEsQ0FBSywwQkFBTCxFQUFpQyxJQUFDLENBQUEsT0FBbEMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUZBO0lBQUEsQ0FuQmIsQ0FBQTs7K0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQStCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNYLElBQUEsbUJBQUEsQ0FBb0IsTUFBcEIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFBLEVBRFc7RUFBQSxDQS9CakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-buffer-colors-handler.coffee
