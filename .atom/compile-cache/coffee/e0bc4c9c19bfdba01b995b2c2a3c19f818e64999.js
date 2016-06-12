(function() {
  var ExpressionsRegistry, PathScanner, VariableExpression, VariableScanner, async, fs;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  PathScanner = (function() {
    function PathScanner(path, registry) {
      this.path = path;
      this.scanner = new VariableScanner({
        registry: registry
      });
    }

    PathScanner.prototype.load = function(done) {
      var currentChunk, currentLine, currentOffset, lastIndex, line, readStream, results;
      currentChunk = '';
      currentLine = 0;
      currentOffset = 0;
      lastIndex = 0;
      line = 0;
      results = [];
      readStream = fs.createReadStream(this.path);
      readStream.on('data', (function(_this) {
        return function(chunk) {
          var index, lastLine, result, v, _i, _len;
          currentChunk += chunk.toString();
          index = lastIndex;
          while (result = _this.scanner.search(currentChunk, lastIndex)) {
            result.range[0] += index;
            result.range[1] += index;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.path = _this.path;
              v.range[0] += index;
              v.range[1] += index;
              v.definitionRange = result.range;
              v.line += line;
              lastLine = v.line;
            }
            results = results.concat(result);
            lastIndex = result.lastIndex;
          }
          if (result != null) {
            currentChunk = currentChunk.slice(lastIndex);
            line = lastLine;
            return lastIndex = 0;
          }
        };
      })(this));
      return readStream.on('end', function() {
        emit('scan-paths:path-scanned', results);
        return done();
      });
    };

    return PathScanner;

  })();

  module.exports = function(_arg) {
    var paths, registry;
    paths = _arg[0], registry = _arg[1];
    registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
    return async.each(paths, function(path, next) {
      return new PathScanner(path, registry).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tcGF0aHMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQUp0QixDQUFBOztBQUFBLEVBTU07QUFDUyxJQUFBLHFCQUFFLElBQUYsRUFBUSxRQUFSLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxPQUFBLElBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLGVBQUEsQ0FBZ0I7QUFBQSxRQUFDLFVBQUEsUUFBRDtPQUFoQixDQUFmLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQUdBLElBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtBQUNKLFVBQUEsOEVBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxFQUFmLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxDQURkLENBQUE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsQ0FGaEIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLENBSFosQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLENBSlAsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLEVBTFYsQ0FBQTtBQUFBLE1BT0EsVUFBQSxHQUFhLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixJ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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-paths-handler.coffee
