(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: require('./config'),
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.disposable = new CompositeDisposable;
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return _this.disposable.add(textEditor.onDidSave(function(event) {
            var grammar;
            grammar = textEditor.getGrammar();
            if (grammar.packageName !== 'language-babel') {
              return;
            }
            return _this.transpiler.transpile(event.path, textEditor);
          }));
        };
      })(this)));
    },
    deactivate: function() {
      if (this.disposable != null) {
        this.disposable.dispose();
      }
      return this.transpiler.stopAllTranspilerTask();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBOztRQUNSLElBQUMsQ0FBQSxhQUFjLEdBQUEsQ0FBQSxDQUFLLE9BQUEsQ0FBUSxjQUFSLENBQUQ7T0FBbkI7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLG1CQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVDLEtBQUMsQ0FBQSxVQUFVLENBQUMsZUFBWixDQUFBLEVBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FBaEIsQ0FIQSxDQUFBO2FBS0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO2lCQUNqRCxLQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsU0FBQyxLQUFELEdBQUE7QUFDbkMsZ0JBQUEsT0FBQTtBQUFBLFlBQUEsT0FBQSxHQUFVLFVBQVUsQ0FBQyxVQUFYLENBQUEsQ0FBVixDQUFBO0FBQ0EsWUFBQSxJQUFVLE9BQU8sQ0FBQyxXQUFSLEtBQXlCLGdCQUFuQztBQUFBLG9CQUFBLENBQUE7YUFEQTttQkFFQSxLQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0IsS0FBSyxDQUFDLElBQTVCLEVBQWtDLFVBQWxDLEVBSG1DO1VBQUEsQ0FBckIsQ0FBaEIsRUFEaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFqQixFQU5RO0lBQUEsQ0FGVjtBQUFBLElBY0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBRyx1QkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQURGO09BQUE7YUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQUEsRUFIVTtJQUFBLENBZFo7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/main.coffee
