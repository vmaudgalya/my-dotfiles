(function() {
  var Commands, CompositeDisposable, EditorLinter, EditorRegistry, Emitter, Helpers, IndieRegistry, Linter, LinterRegistry, LinterViews, MessageRegistry, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  MessageRegistry = require('./message-registry');

  EditorRegistry = require('./editor-registry');

  EditorLinter = require('./editor-linter');

  LinterRegistry = require('./linter-registry');

  IndieRegistry = require('./indie-registry');

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
      this.linters = new LinterRegistry;
      this.indieLinters = new IndieRegistry();
      this.editors = new EditorRegistry;
      this.messages = new MessageRegistry();
      this.views = new LinterViews(state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands, this.indieLinters);
      this.indieLinters.observe((function(_this) {
        return function(indieLinter) {
          return indieLinter.onDidDestroy(function() {
            return _this.messages.deleteMessages(indieLinter);
          });
        };
      })(this));
      this.indieLinters.onDidUpdateMessages((function(_this) {
        return function(_arg) {
          var linter, messages;
          linter = _arg.linter, messages = _arg.messages;
          return _this.messages.set({
            linter: linter,
            messages: messages
          });
        };
      })(this));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUR0QixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FMZixDQUFBOztBQUFBLEVBTUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FOakIsQ0FBQTs7QUFBQSxFQU9BLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBUGhCLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FSVixDQUFBOztBQUFBLEVBU0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBVFgsQ0FBQTs7QUFBQSxFQVdNO0FBRVMsSUFBQSxnQkFBRSxLQUFGLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTs7YUFBTSxDQUFDLFFBQVM7T0FBaEI7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFIYixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQU5YLENBQUE7QUFBQSxNQU9B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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/linter.coffee
