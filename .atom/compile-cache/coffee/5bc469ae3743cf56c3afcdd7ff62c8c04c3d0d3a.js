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
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands);
      this.subscriptions.add(this.linters.onDidUpdateMessages((function(_this) {
        return function(info) {
          return _this.messages.set(info);
        };
      })(this)));
      this.subscriptions.add(this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this)));
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
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble();
        };
      })(this));
      editorLinter.onShouldUpdateLineMessages((function(_this) {
        return function() {
          return _this.views.renderLineMessages(true);
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
          return _this.messages.deleteEditorMessages(editor);
        };
      })(this));
      return this.views.notifyEditor(editorLinter);
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
