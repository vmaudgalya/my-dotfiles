(function() {
  module.exports = function(projectPath) {
    var babel, babelCoreUsed, callback, path, projectBabelCore;
    path = require('path');
    callback = this.async();
    process.chdir(projectPath);
    projectBabelCore = path.normalize(path.join(projectPath, '/node_modules/babel-core'));
    try {
      babel = require(projectBabelCore);
    } catch (_error) {
      projectBabelCore = 'babel-core';
      babel = require(projectBabelCore);
    }
    babelCoreUsed = "Using babel-core at\n" + (require.resolve(projectBabelCore));
    return process.on('message', function(mObj) {
      if (mObj.command === 'transpile') {
        babel.transformFile(mObj.pathTo.sourceFile, mObj.babelOptions, (function(_this) {
          return function(err, result) {
            var msgRet;
            msgRet = {};
            msgRet.reqId = mObj.reqId;
            if (err) {
              msgRet.err = {};
              if (err.loc) {
                msgRet.err.loc = err.loc;
              }
              if (err.codeFrame) {
                msgRet.err.codeFrame = err.codeFrame;
              } else {
                msgRet.err.codeFrame = "";
              }
              msgRet.err.message = err.message;
            }
            if (result) {
              msgRet.result = result;
              msgRet.result.ast = null;
              if (result.ignored != null) {
                msgRet.ignored = false;
              }
            }
            msgRet.babelVersion = babel.version;
            msgRet.babelCoreUsed = babelCoreUsed;
            return emit("transpile:" + mObj.reqId, msgRet);
          };
        })(this));
      }
      if (mObj.command === 'stop') {
        return callback();
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL3RyYW5zZm9ybWVyLXRhc2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO0FBRWYsUUFBQSxzREFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FEWCxDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsS0FBUixDQUFjLFdBQWQsQ0FGQSxDQUFBO0FBQUEsSUFJQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsU0FBTCxDQUFnQixJQUFJLENBQUMsSUFBTCxDQUFXLFdBQVgsRUFBd0IsMEJBQXhCLENBQWhCLENBSm5CLENBQUE7QUFLQTtBQUNFLE1BQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUFSLENBREY7S0FBQSxjQUFBO0FBSUUsTUFBQSxnQkFBQSxHQUFtQixZQUFuQixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGdCQUFSLENBRFIsQ0FKRjtLQUxBO0FBQUEsSUFZQSxhQUFBLEdBQWlCLHVCQUFBLEdBQXNCLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBQUQsQ0FadkMsQ0FBQTtXQWNBLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixTQUFDLElBQUQsR0FBQTtBQUNwQixNQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsS0FBZ0IsV0FBbkI7QUFFRSxRQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBaEMsRUFBNEMsSUFBSSxDQUFDLFlBQWpELEVBQStELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxHQUFELEVBQUssTUFBTCxHQUFBO0FBRTdELGdCQUFBLE1BQUE7QUFBQSxZQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSSxDQUFDLEtBRHBCLENBQUE7QUFFQSxZQUFBLElBQUcsR0FBSDtBQUNFLGNBQUEsTUFBTSxDQUFDLEdBQVAsR0FBYSxFQUFiLENBQUE7QUFDQSxjQUFBLElBQUcsR0FBRyxDQUFDLEdBQVA7QUFBZ0IsZ0JBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFYLEdBQWlCLEdBQUcsQ0FBQyxHQUFyQixDQUFoQjtlQURBO0FBRUEsY0FBQSxJQUFHLEdBQUcsQ0FBQyxTQUFQO0FBQ0UsZ0JBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLEdBQXVCLEdBQUcsQ0FBQyxTQUEzQixDQURGO2VBQUEsTUFBQTtBQUVLLGdCQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxHQUF1QixFQUF2QixDQUZMO2VBRkE7QUFBQSxjQUtBLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBWCxHQUFxQixHQUFHLENBQUMsT0FMekIsQ0FERjthQUZBO0FBU0EsWUFBQSxJQUFHLE1BQUg7QUFDRSxjQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BQWhCLENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZCxHQUFvQixJQURwQixDQUFBO0FBRUEsY0FBQSxJQUFHLHNCQUFIO0FBQ0UsZ0JBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBakIsQ0FERjtlQUhGO2FBVEE7QUFBQSxZQWNBLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLEtBQUssQ0FBQyxPQWQ1QixDQUFBO0FBQUEsWUFlQSxNQUFNLENBQUMsYUFBUCxHQUF1QixhQWZ2QixDQUFBO21CQWdCQSxJQUFBLENBQU0sWUFBQSxHQUFZLElBQUksQ0FBQyxLQUF2QixFQUFnQyxNQUFoQyxFQWxCNkQ7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvRCxDQUFBLENBRkY7T0FBQTtBQXNCQSxNQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsS0FBZ0IsTUFBbkI7ZUFBK0IsUUFBQSxDQUFBLEVBQS9CO09BdkJvQjtJQUFBLENBQXRCLEVBaEJlO0VBQUEsQ0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/transformer-task.coffee
