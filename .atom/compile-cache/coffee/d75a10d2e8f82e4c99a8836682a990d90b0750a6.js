(function() {
  var CompositeDisposable, INTERFILESAVETIME;

  CompositeDisposable = require('atom').CompositeDisposable;

  INTERFILESAVETIME = 1000;

  module.exports = {
    config: require('./config'),
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.disposable = new CompositeDisposable;
      this.textEditors = {};
      this.fileSaveTimes = {};
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          _this.textEditors[textEditor.id] = new CompositeDisposable;
          _this.textEditors[textEditor.id].add(textEditor.onDidSave(function(event) {
            var filePath, lastSaveTime, _ref;
            if (textEditor.getGrammar().packageName === 'language-babel') {
              filePath = textEditor.getPath();
              lastSaveTime = (_ref = _this.fileSaveTimes[filePath]) != null ? _ref : 0;
              _this.fileSaveTimes[filePath] = Date.now();
              if (lastSaveTime < (_this.fileSaveTimes[filePath] - INTERFILESAVETIME)) {
                return _this.transpiler.transpile(filePath, textEditor);
              }
            }
          }));
          return _this.textEditors[textEditor.id].add(textEditor.onDidDestroy(function() {
            var filePath;
            filePath = textEditor.getPath();
            if (_this.fileSaveTimes[filePath] != null) {
              delete _this.fileSaveTimes[filePath];
            }
            _this.textEditors[textEditor.id].dispose();
            return delete _this.textEditors[textEditor.id];
          }));
        };
      })(this)));
    },
    deactivate: function() {
      var disposeable, id, _ref;
      this.disposable.dispose();
      _ref = this.textEditors;
      for (id in _ref) {
        disposeable = _ref[id];
        disposeable.dispose();
      }
      return this.transpiler.stopAllTranspilerTask();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixJQUZwQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSxVQUFSLENBQVI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTs7UUFDUixJQUFDLENBQUEsYUFBYyxHQUFBLENBQUEsQ0FBSyxPQUFBLENBQVEsY0FBUixDQUFEO09BQW5CO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLEdBQUEsQ0FBQSxtQkFGZCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBSGYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFKakIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLFVBQVUsQ0FBQyxlQUFaLENBQUEsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixDQUFoQixDQU5BLENBQUE7YUFTQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7QUFDaEQsVUFBQSxLQUFDLENBQUEsV0FBWSxDQUFBLFVBQVUsQ0FBQyxFQUFYLENBQWIsR0FBOEIsR0FBQSxDQUFBLG1CQUE5QixDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsV0FBWSxDQUFBLFVBQVUsQ0FBQyxFQUFYLENBQWMsQ0FBQyxHQUE1QixDQUFnQyxVQUFVLENBQUMsU0FBWCxDQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNuRCxnQkFBQSw0QkFBQTtBQUFBLFlBQUEsSUFBRyxVQUFVLENBQUMsVUFBWCxDQUFBLENBQXVCLENBQUMsV0FBeEIsS0FBdUMsZ0JBQTFDO0FBQ0UsY0FBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFBQSxjQUNBLFlBQUEsMkRBQTBDLENBRDFDLENBQUE7QUFBQSxjQUVBLEtBQUMsQ0FBQSxhQUFjLENBQUEsUUFBQSxDQUFmLEdBQTJCLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FGM0IsQ0FBQTtBQUdBLGNBQUEsSUFBSyxZQUFBLEdBQWUsQ0FBQyxLQUFDLENBQUEsYUFBYyxDQUFBLFFBQUEsQ0FBZixHQUEyQixpQkFBNUIsQ0FBcEI7dUJBQ0UsS0FBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLFFBQXRCLEVBQWdDLFVBQWhDLEVBREY7ZUFKRjthQURtRDtVQUFBLENBQXJCLENBQWhDLENBREEsQ0FBQTtpQkFRQSxLQUFDLENBQUEsV0FBWSxDQUFBLFVBQVUsQ0FBQyxFQUFYLENBQWMsQ0FBQyxHQUE1QixDQUFnQyxVQUFVLENBQUMsWUFBWCxDQUF3QixTQUFBLEdBQUE7QUFDdEQsZ0JBQUEsUUFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBWCxDQUFBO0FBQ0EsWUFBQSxJQUFHLHFDQUFIO0FBQWtDLGNBQUEsTUFBQSxDQUFBLEtBQU8sQ0FBQSxhQUFjLENBQUEsUUFBQSxDQUFyQixDQUFsQzthQURBO0FBQUEsWUFFQSxLQUFDLENBQUEsV0FBWSxDQUFBLFVBQVUsQ0FBQyxFQUFYLENBQWMsQ0FBQyxPQUE1QixDQUFBLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQUEsS0FBUSxDQUFBLFdBQVksQ0FBQSxVQUFVLENBQUMsRUFBWCxFQUprQztVQUFBLENBQXhCLENBQWhDLEVBVGdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBaEIsRUFWUTtJQUFBLENBRlY7QUFBQSxJQTJCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxxQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFBQSxXQUFBLFVBQUE7K0JBQUE7QUFDRSxRQUFBLFdBQVcsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQURGO0FBQUEsT0FEQTthQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxFQUpVO0lBQUEsQ0EzQlo7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/main.coffee
