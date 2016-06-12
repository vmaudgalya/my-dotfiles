(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(paths, registry, callback) {
      var results, taskPath;
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, [paths, registry.serialize()], (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var _ref;
      return (_ref = this.task) != null ? _ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhdGhzLXNjYW5uZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsUUFBbEIsR0FBQTtBQUNULFVBQUEsaUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxPQUFPLENBQUMsT0FBUixDQUFnQiw0QkFBaEIsQ0FEWCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQyxJQUFMLENBQ04sUUFETSxFQUVOLENBQUMsS0FBRCxFQUFRLFFBQVEsQ0FBQyxTQUFULENBQUEsQ0FBUixDQUZNLEVBR04sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNFLFVBQUEsS0FBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7aUJBQ0EsUUFBQSxDQUFTLE9BQVQsRUFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSE0sQ0FIUixDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyx5QkFBVCxFQUFvQyxTQUFDLE1BQUQsR0FBQTtlQUNsQyxPQUFBLEdBQVUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBRHdCO01BQUEsQ0FBcEMsQ0FYQSxDQUFBO2FBY0EsSUFBQyxDQUFBLEtBZlE7SUFBQSxDQUFYO0FBQUEsSUFpQkEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsSUFBQTs4Q0FBSyxDQUFFLFNBQVAsQ0FBQSxXQURvQjtJQUFBLENBakJ0QjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/paths-scanner.coffee
