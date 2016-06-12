(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry, scope;
      this.buffer = config.buffer, registry = config.registry, scope = config.scope;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tYnVmZmVyLXZhcmlhYmxlcy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUZyQixDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixHQUxyQixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdDQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsZUFBQTtBQUFBLE1BQUMsSUFBQyxDQUFBLGdCQUFBLE1BQUYsRUFBVSxrQkFBQSxRQUFWLEVBQW9CLGVBQUEsS0FBcEIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGtCQUExQyxDQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxlQUFBLENBQWdCO0FBQUEsUUFBQyxVQUFBLFFBQUQ7QUFBQSxRQUFXLE9BQUEsS0FBWDtPQUFoQixDQUZmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFIWCxDQURXO0lBQUEsQ0FBYjs7QUFBQSxxQ0FNQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxrQkFBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLENBQVosQ0FBQTtBQUNBLGFBQU0sT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsTUFBakIsRUFBeUIsU0FBekIsQ0FBaEIsR0FBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsT0FBaEIsQ0FBWCxDQUFBO0FBRUEsUUFBQSxJQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsSUFBbUIsa0JBQXhDO0FBQUEsVUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsQ0FBQTtTQUZBO0FBQUEsUUFHQyxZQUFhLFFBQWIsU0FIRCxDQURGO01BQUEsQ0FEQTthQU9BLElBQUMsQ0FBQSxjQUFELENBQUEsRUFSSTtJQUFBLENBTk4sQ0FBQTs7QUFBQSxxQ0FnQkEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQUEsQ0FBSyw2QkFBTCxFQUFvQyxJQUFDLENBQUEsT0FBckMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUZHO0lBQUEsQ0FoQmhCLENBQUE7O2tDQUFBOztNQVJGLENBQUE7O0FBQUEsRUE0QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxNQUFELEdBQUE7V0FDWCxJQUFBLHNCQUFBLENBQXVCLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBQSxFQURXO0VBQUEsQ0E1QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-buffer-variables-handler.coffee
