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
      projectBabelCore = '../node_modules/babel-core';
      babel = require(projectBabelCore);
    }
    babelCoreUsed = "Using babel-core at\n" + (require.resolve(projectBabelCore));
    return process.on('message', function(mObj) {
      var err, msgRet;
      if (mObj.command === 'transpile') {
        try {
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
              }
              msgRet.babelVersion = babel.version;
              msgRet.babelCoreUsed = babelCoreUsed;
              emit("transpile:" + mObj.reqId, msgRet);
              if (!mObj.pathTo.sourceFileInProject) {
                return callback();
              }
            };
          })(this));
        } catch (_error) {
          err = _error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'stop') {
        return callback();
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL3RyYW5zcGlsZXItdGFzay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7QUFDZixRQUFBLHNEQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQURYLENBQUE7QUFBQSxJQUVBLE9BQU8sQ0FBQyxLQUFSLENBQWMsV0FBZCxDQUZBLENBQUE7QUFBQSxJQUlBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxTQUFMLENBQWdCLElBQUksQ0FBQyxJQUFMLENBQVcsV0FBWCxFQUF3QiwwQkFBeEIsQ0FBaEIsQ0FKbkIsQ0FBQTtBQUtBO0FBQ0UsTUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGdCQUFSLENBQVIsQ0FERjtLQUFBLGNBQUE7QUFJRSxNQUFBLGdCQUFBLEdBQW1CLDRCQUFuQixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGdCQUFSLENBRFIsQ0FKRjtLQUxBO0FBQUEsSUFZQSxhQUFBLEdBQWlCLHVCQUFBLEdBQXNCLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBQUQsQ0FadkMsQ0FBQTtXQWNBLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixTQUFDLElBQUQsR0FBQTtBQUNwQixVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsS0FBZ0IsV0FBbkI7QUFDRTtBQUNFLFVBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFoQyxFQUE0QyxJQUFJLENB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/transpiler-task.coffee
