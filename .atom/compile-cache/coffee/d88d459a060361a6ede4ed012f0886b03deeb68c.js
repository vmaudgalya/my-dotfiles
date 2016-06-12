(function() {
  var ExpressionsRegistry, PathScanner, VariableExpression, VariableScanner, async, fs, scopeFromFileName;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  scopeFromFileName = require('../scope-from-file-name');

  PathScanner = (function() {
    function PathScanner(filePath, registry) {
      var scope;
      this.filePath = filePath;
      scope = scopeFromFileName(this.filePath);
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
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
      readStream = fs.createReadStream(this.filePath);
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
              v.path = _this.filePath;
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
    return async.each(paths, function(p, next) {
      return new PathScanner(p, registry).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tcGF0aHMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUdBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQUp0QixDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHlCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFPTTtBQUNTLElBQUEscUJBQUUsUUFBRixFQUFZLFFBQVosR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsaUJBQUEsQ0FBa0IsSUFBQyxDQUFBLFFBQW5CLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLGVBQUEsQ0FBZ0I7QUFBQSxRQUFDLFVBQUEsUUFBRDtBQUFBLFFBQVcsT0FBQSxLQUFYO09BQWhCLENBRGYsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBSUEsSUFBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO0FBQ0osVUFBQSw4RUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTtBQUFBLE1BQ0EsV0FBQSxHQUFjLENBRGQsQ0FBQTtBQUFBLE1BRUEsYUFBQSxHQUFnQixD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

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/tasks/scan-paths-handler.coffee
