(function() {
  var Commands, CompositeDisposable,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:previous-error': (function(_this) {
          return function() {
            return _this.previousError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:togglePanel': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.index = null;
    }

    Commands.prototype.togglePanel = function() {
      return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    };

    Commands.prototype.toggleLinter = function() {
      var activeEditor, editorLinter;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      editorLinter = this.linter.getEditorLinter(activeEditor);
      if (editorLinter) {
        return editorLinter.dispose();
      } else {
        this.linter.createEditorLinter(activeEditor);
        return this.lint();
      }
    };

    Commands.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    Commands.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, _ref;
      try {
        return (_ref = this.linter.getActiveEditorLinter()) != null ? _ref.lint(false) : void 0;
      } catch (_error) {
        error = _error;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.getMessage = function(index) {
      var messages;
      messages = this.linter.views.messages;
      return messages[__modulo(index, messages.length)];
    };

    Commands.prototype.nextError = function() {
      var message;
      if (this.index != null) {
        this.index++;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.previousError = function() {
      var message;
      if (this.index != null) {
        this.index--;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.dispose = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZtYXVkZ2FseWEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9jb21tYW5kcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQSw2REFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRU07QUFDUyxJQUFBLGtCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtBQUFBLFFBQ0EsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekI7QUFBQSxRQUVBLGVBQUEsRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGakI7QUFBQSxRQUdBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FB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

//# sourceURL=/Users/vmaudgalya/.atom/packages/linter/lib/commands.coffee
