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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBOztRQUNSLElBQUMsQ0FBQSxhQUFjLEdBQUEsQ0FBQSxDQUFLLE9BQUEsQ0FBUSxjQUFSLENBQUQ7T0FBbkI7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLG1CQUZkLENBQUE7YUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsU0FBWCxDQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNuQyxnQkFBQSxPQUFBO0FBQUEsWUFBQSxPQUFBLEdBQVUsVUFBVSxDQUFDLFVBQVgsQ0FBQSxDQUFWLENBQUE7QUFDQSxZQUFBLElBQVUsT0FBTyxDQUFDLFdBQVIsS0FBeUIsZ0JBQW5DO0FBQUEsb0JBQUEsQ0FBQTthQURBO21CQUVBLEtBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixLQUFLLENBQUMsSUFBNUIsRUFBa0MsVUFBbEMsRUFIbUM7VUFBQSxDQUFyQixDQUFoQixFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLEVBSlE7SUFBQSxDQUZWO0FBQUEsSUFZQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFHLHVCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFBLENBREY7T0FBQTthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxFQUhVO0lBQUEsQ0FaWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/main.coffee
