(function() {
  var AutoIndent, CompositeDisposable, INTERFILESAVETIME, LB, autoCompleteJSX;

  CompositeDisposable = require('atom').CompositeDisposable;

  autoCompleteJSX = require('./auto-complete-jsx');

  AutoIndent = require('./auto-indent');

  INTERFILESAVETIME = 1000;

  LB = 'language-babel';

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
          _this.textEditors[textEditor.id].add(textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1, _ref2;
            if (textEditor.getGrammar().packageName === LB) {
              return _this.textEditors[textEditor.id].autoIndent = new AutoIndent(textEditor);
            } else {
              if ((_ref = _this.textEditors[textEditor.id]) != null) {
                if ((_ref1 = _ref.autoIndent) != null) {
                  _ref1.destroy();
                }
              }
              return delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
            }
          }));
          _this.textEditors[textEditor.id].add(textEditor.onDidSave(function(event) {
            var filePath, lastSaveTime, _ref;
            if (textEditor.getGrammar().packageName === LB) {
              filePath = textEditor.getPath();
              lastSaveTime = (_ref = _this.fileSaveTimes[filePath]) != null ? _ref : 0;
              _this.fileSaveTimes[filePath] = Date.now();
              if (lastSaveTime < (_this.fileSaveTimes[filePath] - INTERFILESAVETIME)) {
                return _this.transpiler.transpile(filePath, textEditor);
              }
            }
          }));
          return _this.textEditors[textEditor.id].add(textEditor.onDidDestroy(function() {
            var filePath, _ref, _ref1, _ref2;
            if ((_ref = _this.textEditors[textEditor.id]) != null) {
              if ((_ref1 = _ref.autoIndent) != null) {
                _ref1.destroy();
              }
            }
            delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
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
        if (this.textEditors[id].autoIndent != null) {
          this.textEditors[id].autoIndent.destroy();
          delete this.textEditors[id].autoIndent;
        }
        disposeable.dispose();
      }
      this.transpiler.stopAllTranspilerTask();
      return this.transpiler.disposables.dispose();
    },
    JSXCompleteProvider: function() {
      return autoCompleteJSX;
    },
    provide: function() {
      return this.transpiler;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmFiZWwvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLElBSnBCLENBQUE7O0FBQUEsRUFLQSxFQUFBLEdBQUssZ0JBTEwsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxPQUFBLENBQVEsVUFBUixDQUFSO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7O1FBQ1IsSUFBQyxDQUFBLGFBQWMsR0FBQSxDQUFBLENBQUssT0FBQSxDQUFRLGNBQVIsQ0FBRDtPQUFuQjtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsbUJBRmQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUhmLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBSmpCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVDLEtBQUMsQ0FBQSxVQUFVLENBQUMsZUFBWixDQUFBLEVBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/language-babel/lib/main.coffee
