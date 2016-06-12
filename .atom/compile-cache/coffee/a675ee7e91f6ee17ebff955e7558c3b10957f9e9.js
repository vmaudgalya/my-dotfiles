(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter(state) {
      var _base;
      this.state = state;
      if ((_base = this.state).scope == null) {
        _base.scope = 'File';
      }
      this.lintOnFly = true;
      this.emitter = new Emitter;
      this.linters = new (require('./linter-registry'))();
      this.editors = new (require('./editor-registry'))();
      this.messages = new (require('./message-registry'))();
      this.views = new LinterViews(state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands);
      this.linters.onDidUpdateMessages((function(_this) {
        return function(_arg) {
          var editor, linter, messages;
          linter = _arg.linter, messages = _arg.messages, editor = _arg.editor;
          return _this.messages.set({
            linter: linter,
            messages: messages,
            editorLinter: _this.editors.ofTextEditor(editor)
          });
        };
      })(this));
      this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this));
      this.views.onDidUpdateScope((function(_this) {
        return function(scope) {
          return _this.state.scope = scope;
        };
      })(this));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.createEditorLinter(editor);
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this.linters.deleteLinter(linter);
      return this.deleteMessages(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.hasLinter(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters.getLinters();
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set({
        linter: linter,
        messages: messages
      });
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages.deleteMessages(linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.publicMessages;
    };

    Linter.prototype.onDidUpdateMessages = function(callback) {
      return this.messages.onDidUpdateMessages(callback);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.getEditorLinterByPath = function(path) {
      return this.editors.ofPath(path);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      if (this.editors.has(editor)) {
        return;
      }
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble(editorLinter);
        };
      })(this));
      editorLinter.onShouldLint((function(_this) {
        return function(onChange) {
          return _this.linters.lint({
            onChange: onChange,
            editorLinter: editorLinter
          });
        };
      })(this));
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.messages.deleteEditorMessages(editorLinter);
        };
      })(this));
      editorLinter.onDidCalculateLineMessages((function(_this) {
        return function() {
          _this.views.updateCounts();
          if (_this.state.scope === 'Line') {
            return _this.views.bottomPanel.refresh();
          }
        };
      })(this));
      return this.views.notifyEditorLinter(editorLinter);
    };

    Linter.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUR0QixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT007QUFFUyxJQUFBLGdCQUFFLEtBQUYsR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBOzthQUFNLENBQUMsUUFBUztPQUFoQjtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUhiLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BTlgsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBUGYsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBUmYsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxDQUFDLE9B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/linter.coffee
