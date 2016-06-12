(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3BhdGhzLWxvYWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ1QsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLEVBRFYsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDRCQUFoQixDQUZYLENBQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUNMLFFBREssRUFFTCxNQUZLLEVBR0wsU0FBQSxHQUFBO2VBQUcsUUFBQSxDQUFTO0FBQUEsVUFBQyxTQUFBLE9BQUQ7QUFBQSxVQUFVLFNBQUEsT0FBVjtTQUFULEVBQUg7TUFBQSxDQUhLLENBSlAsQ0FBQTtBQUFBLE1BVUEsSUFBSSxDQUFDLEVBQUwsQ0FBUSx3QkFBUixFQUFrQyxTQUFDLEtBQUQsR0FBQTtlQUFXLE9BQU8sQ0FBQyxJQUFSLGdCQUFhLEtBQWIsRUFBWDtNQUFBLENBQWxDLENBVkEsQ0FBQTtBQUFBLE1BV0EsSUFBSSxDQUFDLEVBQUwsQ0FBUSx1QkFBUixFQUFpQyxTQUFDLEtBQUQsR0FBQTtlQUFXLE9BQU8sQ0FBQyxJQUFSLGdCQUFhLEtBQWIsRUFBWDtNQUFBLENBQWpDLENBWEEsQ0FBQTthQWFBLEtBZFM7SUFBQSxDQUFYO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/pigments/lib/paths-loader.coffee
