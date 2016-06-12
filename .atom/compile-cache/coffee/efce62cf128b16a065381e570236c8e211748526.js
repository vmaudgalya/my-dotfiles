(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry;
      this.buffer = config.buffer, registry = config.registry;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry
      });
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLXZhcmlhYmxlcy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUZyQixDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixHQUxyQixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdDQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsUUFBQTtBQUFBLE1BQUMsSUFBQyxDQUFBLGdCQUFBLE1BQUYsRUFBVSxrQkFBQSxRQUFWLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxtQkFBbUIsQ0FBQyxXQUFwQixDQUFnQyxRQUFoQyxFQUEwQyxrQkFBMUMsQ0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsZUFBQSxDQUFnQjtBQUFBLFFBQUMsVUFBQSxRQUFEO09BQWhCLENBRmYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUhYLENBRFc7SUFBQSxDQUFiOztBQUFBLHFDQU1BLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLGtCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBWixDQUFBO0FBQ0EsYUFBTSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxNQUFqQixFQUF5QixTQUF6QixDQUFoQixHQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixPQUFoQixDQUFYLENBQUE7QUFFQSxRQUFBLElBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxJQUFtQixrQkFBeEM7QUFBQSxVQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxDQUFBO1NBRkE7QUFBQSxRQUdDLFlBQWEsUUFBYixTQUhELENBREY7TUFBQSxDQURBO2FBT0EsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQVJJO0lBQUEsQ0FOTixDQUFBOztBQUFBLHFDQWdCQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBQSxDQUFLLDZCQUFMLEVBQW9DLElBQUMsQ0FBQSxPQUFyQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBRkc7SUFBQSxDQWhCaEIsQ0FBQTs7a0NBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQTRCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNYLElBQUEsc0JBQUEsQ0FBdUIsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFBLEVBRFc7RUFBQSxDQTVCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-buffer-variables-handler.coffee
